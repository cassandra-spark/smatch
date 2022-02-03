from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer
                            as Serializer, BadSignature, SignatureExpired)
from flask_httpauth import HTTPTokenAuth
from flask_migrate import Migrate

import psycopg2
import psycopg2.extras

from recommender import make_clusters

conn = psycopg2.connect("host=35.225.226.208 dbname=course-list user=postgres password=1234567890")

app = Flask(__name__)
app.config['SECRET_KEY'] = 'akslfIFD423Ah'

auth = HTTPTokenAuth(scheme='Bearer')

CORS(app)

class User:
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

def get_user(username):
    cur = conn.cursor()
    cur.execute('SELECT id, username, password FROM users WHERE username = %s', (username,))
    user = cur.fetchone()
    cur.close()

    if user is None:
        return None

    (id, username, password) = user
    return User(id, username, password)

def get_user_by_id(id):
    cur = conn.cursor()
    cur.execute('SELECT id, username, password FROM users WHERE id = %s', (id,))
    user = cur.fetchone()
    cur.close()

    if user is None:
        return None

    (id, username, password) = user
    return User(id, username, password)

## User Registration
@app.route('/signup', methods = ['POST'])
def new_user():
    username = request.json.get('username')
    password = request.json.get('password')
    if username is None or password is None:
        abort(400) # missing arguments
    if get_user(username) is not None:
        abort(400) # existing user
    cur = conn.cursor()
    cur.execute('INSERT INTO users (username, password) VALUES (%s, %s)', (username, pwd_context.hash(password)))
    conn.commit()
    cur.close()
    return jsonify({ 'username': username }), 201

def generate_auth_token(user, expiration = 600):
    s = Serializer(app.config['SECRET_KEY'], expires_in = expiration)
    return s.dumps({ 'id': user.id })

## User Login
@app.route('/login', methods = ['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = get_user(username)
    if not user or not pwd_context.verify(password, user.password):
        abort(400)
    return jsonify({ "token": generate_auth_token(user).decode('ascii') })

def verify_auth_token(token):
    s = Serializer(app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
    except SignatureExpired:
        return None # valid token, but expired
    except BadSignature:
        return None # invalid token
    user = get_user_by_id(data['id'])
    return user

@auth.verify_token
def verify_token(token):
    user = verify_auth_token(token)
    if not user:
        return False
    return user

@app.route('/topics')
@auth.login_required
def list_topics():
    cur = conn.cursor()
    cur.execute('SELECT DISTINCT category FROM courselist ORDER BY category ASC')

    topics = list()
    for (name,) in cur:
        topics.append(name)
    cur.close()
    
    return jsonify(topics)

#This access the database of all the threads
@app.route('/threads')
@auth.login_required
def show_threads():
    cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
    cur.execute('''
WITH reply_count AS (SELECT thread_id, count(id) FROM replies GROUP BY thread_id),
     last_reply AS (SELECT thread_id, max(created_on) FROM replies GROUP BY thread_id)
SELECT threads.*, username, coalesce(reply_count.count, 0) replies, coalesce(last_reply.max, created_on) AS last_reply_on
    FROM threads
    JOIN users ON threads.user_id = users.id
    LEFT OUTER JOIN reply_count ON threads.id = reply_count.thread_id
    LEFT OUTER JOIN last_reply ON threads.id = last_reply.thread_id
    ORDER BY last_reply_on DESC
    ''')
    threads = cur.fetchall()
    cur.close()
    return jsonify(threads)

# this shows the replies for a specific thread
@app.route('/threads/<thread_id>')
@auth.login_required
def show_replies(thread_id):
    cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
    cur.execute('SELECT threads.*, username FROM threads JOIN users ON threads.user_id = users.id WHERE threads.id = %s', (int(thread_id),))
    thread = cur.fetchone()
    cur.close()

    if not thread:
        abort(404)

    cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
    cur.execute('SELECT replies.*, username FROM replies JOIN users ON replies.user_id = users.id WHERE replies.thread_id = %s ORDER BY created_on ASC', (int(thread_id),))
    replies = cur.fetchall()
    cur.close()

    thread['replies'] = replies

    return jsonify(thread)

@app.route('/user_count')
@auth.login_required
def user_count():
    cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
    cur.execute('SELECT count(*) FROM users')
    user_count = cur.fetchone()
    cur.close()
    return jsonify(user_count)

# Add new threads
@app.route('/threads', methods = ['POST'])
@auth.login_required
def new_thread():
    user = auth.current_user()
    title = request.json.get('title')
    category = request.json.get('category')
    body = request.json.get('body')

    cur = conn.cursor()
    cur.execute('INSERT INTO threads (user_id, title, category, body) VALUES (%s, %s, %s, %s) RETURNING id', (user.id, title, category, body))
    conn.commit()
    (id,) = cur.fetchone()
    cur.close()

    return { "thread_id": id }, 201

@app.route('/threads/<thread_id>/replies', methods = ['POST'])
@auth.login_required
def new_reply(thread_id):
    user = auth.current_user()
    body = request.json.get('body')

    cur = conn.cursor()
    cur.execute('INSERT INTO replies (user_id, thread_id, body) VALUES (%s, %s, %s)', (user.id, thread_id, body))
    conn.commit()
    cur.close()

    return {}, 201

visualization_queries = {
    "instructors": "SELECT count(*), instructor FROM courselist WHERE instructor IS NOT NULL GROUP BY instructor ORDER BY count DESC LIMIT 20",
    "providers": "SELECT count(*), provider FROM courselist WHERE provider IS NOT NULL GROUP BY provider ORDER BY count DESC LIMIT 20",
    "categories": "SELECT count(*), coalesce(category, 'Other') category FROM courselist GROUP BY category ORDER BY count DESC LIMIT 20",
    "levels": "SELECT count(*), level FROM courselist GROUP BY level ORDER BY count DESC",
    "duration": "SELECT count(*), duration FROM courselist WHERE duration IS NOT NULL GROUP BY duration ORDER BY count DESC",
    "price": "SELECT count(*), price FROM courselist WHERE price IS NOT NULL GROUP BY price ORDER BY count DESC"
};

@app.route('/visualization/<name>')
@auth.login_required
def visualization(name):
    cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
    cur.execute(visualization_queries[name])
    result = cur.fetchall()
    cur.close()
    return jsonify(result)

@app.route('/current_user')
@auth.login_required
def current_user():
    user = auth.current_user()
    return jsonify({ "id": user.id, "username": user.username })

@app.route('/current_user', methods = ['POST'])
@auth.login_required
def update_username():
    user = auth.current_user()
    username = request.json.get('username')

    cur = conn.cursor()
    cur.execute('UPDATE users SET username = %s WHERE id = %s', (username, user.id))
    conn.commit()
    cur.close()

    return {}

@app.route('/generate_clusters', methods = ['POST'])
@auth.login_required
def generate_clusters():
    filters = request.json
    (clusters, terms) = make_clusters(filters)
    return jsonify({ "clusters": clusters.to_dict('records'), "terms": terms.to_dict('records') })

@app.route('/course/<id>')
@auth.login_required
def get_course(id):
    cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
    cur.execute('SELECT * FROM courselist WHERE id = %s', (id,))
    course = cur.fetchone()
    cur.close()
    return jsonify(course)

app.run()

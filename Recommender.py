# Still uses the unsafe query
# Basically input from decision tree go to part_one() function which returns the top terms on each cluster for the
# users to swipe on and the result of which lessons belongs to which cluster

# The user then swipe on the terms which we tally up, we pick the cluster with most swipe get chosen, and part_two()
# get the full list from the database (I'm not sure how many courses want to be displayed)

# TODO: Ali is doing the code to get unique words of each cluster

import pandas as pd
import psycopg2
from sqlalchemy import create_engine
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction import text
from sklearn.cluster import KMeans

input_df = {
    "category" : "Photography & Video",
    "price" : "0",
    "duration" : "5",
    "level" : "Beginner",
    "provider": "Coursera",
}

cluster_input ={
    "0" : 3,
    "1" : 2,
    "2" : 4,
    "3" : 2,
    "4" : 6,
    "5" : 2,
    "6" : 1,
    "7" : 8,
}

# open connection
conn = psycopg2.connect(
    host="35.225.226.208",
    database="course-list",
    user="postgres",
    password="1234567890")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
pgcursor = conn.cursor()
engine = create_engine("postgresql+psycopg2://postgres:1234567890@35.225.226.208/course-list")

def getraw_db(input_df):
    query = "SELECT * FROM courselist WHERE"
    for key, value in input_df.items():
        if value == "*":
            pass
        elif key == "category":
            input_df[key] = "'" + value + "'"
            query = query + " category = {} AND".format(input_df[key])
        elif key == "price":
            query = query + " price <= {} AND".format(input_df[key])
            pass
        elif key == "duration":
            input_df_key = float(value)
            query = query + " duration <= {} AND".format(input_df[key])
            pass
        elif key == "level":
            input_df[key] = "'" + value + "'"
            query = query + " level <= {} AND".format(input_df[key])
        elif key == "provider":
            input_df[key] = "'" + value + "'"
            query = query + " provider <= {} AND".format(input_df[key])
        else:
            input_df[key] = "'" + value + "'"

    if query.endswith("FROM") or query.endswith("AND"):
        query = query.rsplit(' ', 1)[0]

    # Get Query
    raw_df = pd.read_sql_query(query, con=engine)
    return raw_df

def kmeans (raw_df):
    # Represent each article as a vector
    my_stop_words = text.ENGLISH_STOP_WORDS.union(
        ["learn", "digital", "online", "specialization", "course", "platform", "courses"])
    vectorizer = TfidfVectorizer(ngram_range=(1, 1), stop_words=my_stop_words)
    X = vectorizer.fit_transform(raw_df.description)

    # Chosen based on the elbow method
    true_k = 8
    model = KMeans(n_clusters=true_k, init='k-means++', max_iter=200, n_init=10)
    model.fit(X)
    labels = model.labels_
    result = pd.DataFrame(list(zip(raw_df.name, labels)), columns=['subject', 'cluster'])

    order_centroids = model.cluster_centers_.argsort()[:, ::-1]
    terms = vectorizer.get_feature_names()
    terms_df = pd.DataFrame(columns=["cluster", "text"])
    for i in range(true_k):
        termz = []
        for ind in order_centroids[i, :100]:
            blob = terms[ind]
            termz += [blob]
        dicti = {
            "cluster": i,
            "text": termz
        }
        terms_df = terms_df.append(dicti, ignore_index=True)

    return result, terms_df

def getclusters(cluster_input, result,raw_df):
    max_key = max(cluster_input, key=cluster_input.get)
    chosen_subjects = result.loc[result["cluster"] == int(max_key)]["subject"]
    subjects = pd.DataFrame()
    for subject in chosen_subjects:
        cond = raw_df.loc[raw_df["name"] == subject, :]
        subjects = subjects.append(cond, ignore_index=True)

    return subjects


def part_1 (input_df):
    raw_df = getraw_db(input_df)
    result, terms_df = kmeans(raw_df)
    return result, terms_df

def part_2 (result, cluster_input):
    raw_df = getraw_db(input_df)
    getclusters(cluster_input, result, raw_df)



#close connection
try:
    pgcursor.close()
except (Exception, psycopg2.DatabaseError) as error:
    print(error)
finally:
    if conn is not None:
        conn.close()
        print('Database connection closed.')
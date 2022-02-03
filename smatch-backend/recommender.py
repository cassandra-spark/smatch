import pandas as pd
from sqlalchemy import create_engine

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction import text
from sklearn.cluster import KMeans

engine = create_engine("postgresql+psycopg2://postgres:1234567890@35.225.226.208/course-list")

def get_all_courses(filters):
    query = "SELECT * FROM courselist WHERE category = %s AND price >= %s AND price <= %s AND duration >= %s AND duration <= %s AND level IN %s"
    params = (filters["category"], filters["price_min"], filters["price_max"], filters["duration_min"], filters["duration_max"], tuple(filters["levels"]))
    print(params)

    # Get Query
    courses = pd.read_sql_query(query, con=engine, params=params)
    return courses

def kmeans(courses):
    # Represent each article as a vector
    my_stop_words = text.ENGLISH_STOP_WORDS.union(
        ["learn", "digital", "online", "specialization", "course", "platform", "courses"])
    vectorizer = TfidfVectorizer(ngram_range=(1, 1), stop_words=my_stop_words)
    X = vectorizer.fit_transform(courses.description)

    # Chosen based on the elbow method
    true_k = 8
    model = KMeans(n_clusters=true_k, init='k-means++', max_iter=200, n_init=10)
    model.fit(X)
    labels = model.labels_
    result = pd.DataFrame(list(zip(courses.name, courses.id, labels)), columns=['subject', 'course_id', 'cluster'])

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

def make_clusters(filters):
    courses = get_all_courses(filters)
    (clusters, terms) = kmeans(courses)
    return (clusters, terms)

    # filters = {
        # "category" : "Photography & Video",
        # "price_min" : "0",
        # "price_max" : "100",
        # "duration_min" : "5",
        # "duration_max" : "12",
        # "levels" : ["Beginner", "Intermediate"]
    # }

# import numpy as np

# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.feature_extraction import text
# from sklearn.cluster import KMeans

# def getclusters(cluster_input, result, courses):
    # max_key = max(cluster_input, key=cluster_input.get)
    # chosen_subjects = result.loc[result["cluster"] == int(max_key)]["subject"]
    # subjects = pd.DataFrame()
    # for subject in chosen_subjects:
        # cond = courses.loc[courses["name"] == subject, :]
        # subjects = subjects.append(cond, ignore_index=True)

    # return subjects

# cluster_input ={
    # "0" : 3,
    # "1" : 2,
    # "2" : 4,
    # "3" : 2,
    # "4" : 6,
    # "5" : 2,
    # "6" : 1,
    # "7" : 8,
# }

# subjects = getclusters(cluster_input, clusters, courses)
# print(subjects[["name", "duration", "price", "level"]])

# def part_3 ():
    # l = list(str(data.TopUniqueWords[0]).lower().split(', '))
    # d = {}
    # for k in l:
        # d[k] = l.count(k)
    # dlist = sorted(d.items(), key=lambda x:x[1], reverse = True)
    # sortdict = dict(dlist)
    # print (sortdict)

# def part_4 ():
    # temp_string = data['TopUniqueWords'].str.cat(sep=', ')
    # merged_data = list(str(temp_string).lower().split(', '))
    # dictionary_merged_data = {}
    # for k in merged_data:
        # count = merged_data.count(k)
        # if count == 1:
            # dictionary_merged_data[k] = merged_data.count(k)
    # dlist = sorted(dictionary_merged_data.items(), key=lambda x:x[1], reverse = True)
    # sortdict = dict(dlist)
    # print (sortdict)


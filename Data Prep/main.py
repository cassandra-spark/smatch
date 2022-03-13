import pandas as pd
import requests, json


client_ID = "FPjQAWG0Dd4vejVo6Tu1jurZoamF1zQbOob0k8Q7"
client_secret = "wLo0LigtQI1KyUHCVNbKpgLY9vYZchySspzYAwqAn8mMnxzpdWMUmV5eP7sw8GLI38X0EMlT5N3ZENzgTpvK7CGVoNI3RR88eZ0GF6ssJvlrZNi34MbhVUCj6VUYq4wq"
api_base = "https://www.udemy.com/api-2.0/"

client_id_secret = f"{client_ID}:{client_secret}"

#b64_client_id_secret = base64.b64encode(client_id_secret)


s = requests.session()
s.headers = {'Authorization': 'Basic RlBqUUFXRzBEZDR2ZWpWbzZUdTFqdXJab2FtRjF6UWJPb2IwazhRNzp3TG8wTGlndFFJMUt5VUhDVk5iS3BnTFk5dllaY2h5U3NwellBd3FBbjhtTW54enBkV01VbVY1ZVA3c3c4R0xJMzhYMEVNbFQ1TjNaRU56Z1Rwdks3Q0dWb05JM1JSODhlWjBHRjZzc0p2bHJaTmkzNE1iaFZVQ2o2VlVZcTR3cQ=='}

instructional_levels = ["beginner","intermediate","expert"]
categories =["Business", "Design", "Development", "Finance & Accounting", "Health & Fitness", "IT & Software", "Lifestyle", "Marketing", "Music" ,"Office", "Productivity", "Personal Development", "Photography & Video", "Teaching & Academics", "Udemy Free Resource Center", "Vodafone"]
durations = {"short":"1-3 Hours","medium":"3-6 Hours","long":"6-17 Hours","extralong":"17+ Hours"}

#instructional_levels = ["beginner"]
#categories =["Business"]
#durations = {"short":"1-3 Hours"}





for instructional_level in instructional_levels:
    for category in categories:
        for key, value in durations.items():
            i = 1
            sc = 200
            headers = ["name", "provider", "level", "instructor", "description", "duration", "price", "link"]
            data = pd.DataFrame(columns=headers)
            while i!=11:
                url = api_base + 'courses/?page={}&page_size=100'.format(i)
                print(url)
                args = {
                    "instructional_level" : instructional_level,
                    "duration": key,
                    "language" : "eng",
                    "category" : category,
                    "ratings" : 5
                }

                r = s.get(url)
                sc = r.status_code
                if sc != 200:
                    break
                else:
                    print(r.status_code)
                    parsed_response = json.loads(r.text)
                    df = pd.json_normalize(parsed_response['results'])
                    try:
                        df["instructor"] = [d[0].get('title') for d in df.visible_instructors]
                    except:
                        df["instructor"]= "-"

                    try:
                        df["num_reviews"] = [d[0].get('title') for d in df.num_reviews]
                    except:
                        df["num_reviews"]= "-"

                    for index, row in df.iterrows():
                        url = "https://www.udemy.com" + row["url"]
                        instructor =row["instructor"]
                        dict = {
                            "name": row["title"],
                            "provider": "Udemy",
                            "level": instructional_level,
                            "instructor": instructor,
                            "description": row["headline"],
                            "duration": value,
                            "price": row["price"],
                            "category" : category,
                            "link": url}

                        data = data.append(dict, ignore_index=True)
                    i = i + 1

            filename = instructional_level + "_" + key + "_"+ category + "_raw.csv"
            data.to_csv(filename)
import json, requests, bs4
import pandas as pd

urls = ["https://www.classcentral.com/subject/cs?page="]
links = []

def collectlinks(lessons):
    for lesson in lessons:
        name = lesson.find(class_="color-charcoal course-name")
        link = "https://www.classcentral.com" + name.get('href')
        links.append(link)

def getclasscenterlink(url):
    print('Downloading page ' + url)

    res = requests.get(url)
    res.raise_for_status()
    soup = bs4.BeautifulSoup(res.text, 'html.parser')
    table = soup.find(class_="catalog-grid__results")
    try:
        lessons = table.find_all(class_="bg-white border-all border-gray-light padding-xsmall radius-small margin-bottom-small medium-up-padding-horz-large medium-up-padding-vert-medium course-list-course")
    except:
        return 1

    collectlinks(lessons)

def get_details(link,description):
    if link.endswith("classroom"):
        pass
    else:
        res = requests.get(link)
        res.raise_for_status()
        soup = bs4.BeautifulSoup(res.text, 'html.parser')

        course = {
            "name": "",
            "instructor": "",
            "description": description,
            "provider": "",
            "level": "",
            "duration": "",
            "price": ""
        }

        #Header
        head = soup.find(class_="bg-white small-down-padding-medium padding-large radius-small border-all border-gray-light cmpt-grid-header margin-bottom-medium")
        course["name"] = head.find(class_="head-1").text
        course["instructor"] = head.find(class_="link-gray-underline text-1").get_text().strip()

        #Things in Flex table
        tables = soup.find(class_="bg-white small-down-padding-medium padding-large border-all border-gray-light radius-small margin-bottom-medium")
        course["link"] = "https://www.classcentral.com" + tables.find(class_="margin-bottom-small btn-blue btn-medium width-100").get('href')
        table = tables.find('ul')
        blob = table.find_all("li")
        for element in blob:

            # Provider
            if element.find(class_="icon-provider-charcoal icon-medium") != None:
                course["provider"] = element.find("a").get_text().strip()

            # Level
            if element.find(class_= "icon-level-charcoal icon-medium") != None:
                course["level"] = element.find(class_="text-2 margin-left-small line-tight").get_text().strip()

            #Duration
            if element.find(class_= "icon-clock-charcoal icon-medium") != None:
                course["duration"] = element.find(class_="text-2 margin-left-small line-tight").get_text().strip()

            #Price
            if element.find(class_= "icon-dollar-charcoal icon-medium") != None:
                course["price"] = element.find(class_="text-2 margin-left-small line-tight").get_text().strip()
        return course

def getcourselink():
    for urlr in urls:
        i = 1
        done = 0
        #while done != 1:
        while i != 10:
            url = urlr + str(i)
            done = getclasscenterlink(url)
            i = i+1

    textfile = open("a_file.txt", "w")
    for element in links:
        textfile.write(element + "\n")
    textfile.close()


def main():
    i = 1
    with open('courses.json', encoding="utf8") as json_file:
        data_raw = json.load(json_file)
    df_json = pd.json_normalize(data_raw)
    df = pd.DataFrame()
    df["url"] = df_json["url"]
    df["description"] = df_json["description"]

    headers = ["name", "provider", "level", "instructor", "description", "duration", "price", "link"]
    data = pd.DataFrame(columns=headers)
    for index, row in df.iterrows():
        print(row["url"])
        try:
            course = get_details(row["url"], row["description"])
            data = data.append(course, ignore_index=True)
            print(i)
        except:
            pass
        i = i + 1
    data.to_csv("coursera_raw.csv")
if __name__ == '__main__':
    main()



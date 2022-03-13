from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import pandas as pd
import json

chrome_options = Options()
chrome_options.add_argument("--headless")
browser = webdriver.Chrome(options=chrome_options)


def get_page(url):
    browser.get(url)
    name = browser.find_element(by=By.XPATH, value='//*[@id="main-content"]/div/div[1]/div/div[5]/div[1]/h1').text
    provider = "edx"
    try:
        level_1 = browser.find_element(by=By.XPATH, value='//*[@id="main-content"]/div/div[3]/div/div[2]/div/div/div[1]/ul/li[3]').text
        level = level_1.partition(": ")[2]
    except:
        level = "-"
    try:
        instructor = browser.find_element(by=By.XPATH, value='//*[@id="main-content"]/div/div[3]/div/div[2]/div/div/div[1]/ul/li[1]/a').text
    except:
        instructor = "-"
    try:
        description = browser.find_element(by=By.XPATH, value='//*[@id="main-content"]/div/div[3]/div/div[1]/div[2]/div/p[1]').text
    except:
        description = "-"
    try:
        duration = browser.find_element(by=By.XPATH, value='//*[@id="main-content"]/div/div[2]/div[2]/div/div[1]/div/div/div[1]/div/div[1]').text
    except:
        duration = "-"
    try:
        price = browser.find_element(by=By.XPATH, value='//*[@id="main-content"]/div/div[6]/div/div[2]/div/div[1]/table/tbody/tr[2]/td[1]/p').text
    except:
        price = "-"
    dict = {
        "name":name,
        "provider":provider,
        "level": level,
        "instructor": instructor,
        "description": description,
        "duration": duration,
        "price": price,
        "link": url
    }
    print (dict)
    return dict






def main():
    headers = ["name", "provider", "level", "instructor", "description", "duration", "price", "link"]
    data = pd.DataFrame(columns=headers)
    course_url = []

    with open('courses_raw.json', encoding="utf8") as json_file:
        data_raw = json.load(json_file)

    df = pd.json_normalize(data_raw)
    for url in df["marketing_url"]:
        course_url.append(url)

    for url in course_url:
        print(url)
        try:
            blob = get_page(url)
            data = data.append(blob, ignore_index=True)
        except:
            pass
    data.to_csv("EDX_raw.csv")


if __name__ == '__main__':
    main()

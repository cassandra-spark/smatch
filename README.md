# SMATCH
Your course matching app.

![image](https://user-images.githubusercontent.com/56160802/158058117-826d9b1f-3e1f-48db-b1be-65582610b507.png)

## Description
Have you ever wanted to learn a new skill online?
but you just ended up feeling overwhelmed from the hundreds of different courses to pick from?

Well, we have the solution for you! SMATCH will help you find the course that suits your need based on the budget, time and interest that you have!
Using the cutting-edge machine learning and recommender system technology, we are able to pick suitable courses from over 200 000 courses from all over 
the 3 major MOOCs platforms (EDX, Coursera, Udemy)
## project architecture

![image](https://user-images.githubusercontent.com/56160802/158061096-cedeb3cd-8919-4f26-bb10-fc94f3ea3c4c.png)

## libraries/algorithms used
- Data scraping 
        - Beautiful soup and Udemy developer API, Connections are all done in Python (pandas). 

- Back end
        - Scikit Learn
                - For data preperation, we label the data uniformly using Naive based algorithm text classification
                - For the recommender system, we use TF-IDF content based algorithm before then we put them into clusters using K-Means
                  so we can recommend a specific clusters to the user
       - Pandas
                - To manipulate and clean up the data used for the database
                - Handling data and result of the machine learing and recommender system
        - PostgreSQL and google cloud
                - Files are hosted in Google cloud PostgreSQL database as it needs to be accessible by multiple people and allow
                  faster access due to the massive file size
        - Flask
                - Connection with the front end is done through API developed in Flask

- Front end
        - React 
                - Used to make a single page application
        - Recharts
                - Used to make colourful visualisation
        - Tailwind CSS
                - CSS framework to design the user interface
        - D3
                - Used to create the colour pallette for the visualisation


## screenshots of the visualizations


## how to run the project

## How to deploy your project

## group members
- Jean Qussa
- Nurmalita Manggali
- Nave Wibowo
- Ali Amini

Here are the files used to collect the data from 3 different sources
Coursera scrape.py , EDX_scrape.py, and Udemy_scrape.py are used to get the individual courses 
from each of the providers

As most of the courses come from Udemy, we split the data collection from udemy into multiple files and 
those are combined in aggregate_udemy.py

Finally, all of the courses are aggregated into one csv file with aggregate_all.py

To make sure that all courses are labeled based on their category (eg. Art, Education, Technology, etc.),
We use labeling_process.ipynb to label the data from EDX and Coursera based on the label for Udemy

As the final csv file ended up being over 56 MB, we have decided to only upload the final ones and not the raw ones that 
we made as checkpoints between the scripts 

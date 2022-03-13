import pandas as pd
import os
folder_name = os.getcwd()
files = os.listdir(folder_name)
combined_csv = pd.DataFrame()
for file in files:
    if file.endswith(".csv"):
        csv = pd.read_csv(file)
        #combined_csv = pd.concat(csv)
        combined_csv = combined_csv.append(csv, ignore_index=True)
        print(file)


combined_csv.to_csv("aggregate_raw.csv", index=False )
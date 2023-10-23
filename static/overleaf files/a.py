# Importing necessary libraries
import pandas as pd
import json

# Defining a function to load recommendations
def load_recommendations(): 
    try:
        # Attempting to read a CSV file into a DataFrame
        item_similarity_df = pd.read_csv("applications/movies/static/item_similarity_df.csv",index_col=0)
        # If successful, return the DataFrame
        return item_similarity_df 

    # If a FileNotFoundError is raised, print a custom error message and return None
    except FileNotFoundError:
        print("FileNotFoundError: The file does not exist.")
        return None

    # If any other error is raised, print a custom error message and return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

# Caching the result of the function load_recommendations in memory under the key 'item_similarity_df3' 
item_similarity_df = cache.ram('item_similarity_df3',load_recommendations,None) 
# Define a function to get similar movies based on movie name and user rating
def get_similar_movies(movie_name,user_rating):
    try:
        # Calculate the similarity score
        # The calculation is based on item similarity and adjusted by user rating
        similar_score = item_similarity_df[movie_name]*(user_rating-2.5)
        
        # Sort the movies based on the similarity score in descending order
        similar_movies = similar_score.sort_values(ascending=False)
    except:
        # If the movie is not present in the model, print an error message
        print("No movie is present in the model")
        
        # Return an empty series in case of an error
        similar_movies = pd.Series([])

    # Return the series of similar movies
    return similar_movies
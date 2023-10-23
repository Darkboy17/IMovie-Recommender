@service.json
def get_recommendations(watched_movies):
    similar_movies = pd.DataFrame()
    
    if not isinstance(watched_movies, dict):
        raise TypeError("watched_movies should be a dictionary")
        
    try:
        for movie_id, movie in watched_movies.items():
            similar_movie_series = get_similar_movies(movie["title"], movie["rating"])
            similar_movie_df = similar_movie_series.to_frame(name=None).T
            similar_movies = pd.concat([similar_movies, similar_movie_df], ignore_index=True)
    except Exception as e:
        print("An error occurred:", e)
        return []

    all_recommend = similar_movies.sum().sort_values(ascending=False)

    recommended_movies = []

    try:
        for movie,score in all_recommend.items():
            if not check_seen(movie,watched_movies):
                recommended_movies.append(movie)    
    except Exception as e:
        print("An error occurred:", e)
        return []

    if len(recommended_movies) > 100:
        recommended_movies = recommended_movies[0:100]      

    return recommended_movies

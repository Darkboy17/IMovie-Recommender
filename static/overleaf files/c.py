def check_seen(recommended_movie, watched_movies):
    try:
        # Check if recommended_movie is a string
        if not isinstance(recommended_movie, str):
            raise TypeError('recommended_movie must be a string')

        # Check if watched_movies is a dictionary
        if not isinstance(watched_movies, dict):
            raise TypeError('watched_movies must be a dictionary')

        for movie_id, movie in watched_movies.items():
            # Check if movie has a title property
            if "title" not in movie:
                raise KeyError('Each movie in watched_movies must have a "title" key')

            movie_title = movie["title"]

            if recommended_movie == movie_title:
                return True
              
        return False

    except TypeError as error:
        print(f"TypeError: {error}")
    except KeyError as error:
        print(f"KeyError: {error}")
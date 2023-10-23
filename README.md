# IMovie Recommender

IMovie Recommender is a movie recommendation system built with the web2py framework using ML. For the backend, libaries such as pandas, numpy was used in Python for the calculation of recommendations. 
For the front-end, HTML/CSS/JS was used. 
It uses an algorithm called "Cosine Similarity" from a plethora of recommendation algorithms, to provide users with movie recommendations based on the ratings of a movie.

## Features

- Search filtering
- Personalized movie recommendations
- User-friendly interface
- A movie carousel

## Screenshot
![Screenshot](https://github.com/Darkboy17/IMovie-Recommender/assets/26376179/666e6f3a-e0f5-4a88-8393-13a7168e5ca6)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run the web application on your local machine, follow the following steps.

1) First, download web2py from this link : https://mdipierro.pythonanywhere.com/examples/static/nightly/web2py_src.zip
2) Second, download the Recommendations Model File: https://drive.google.com/file/d/17orEFW-9isAQJW4yriiaMwLGBkV_DVig/view?usp=share_link
  - Place this file under the "\web2py\applications\movies\static\" folder.
3) [Optional] Finally, download the mid- quality posters for loading in the app: https://drive.google.com/file/d/1RGZgTpcRl68AMoASxpyC7LDRYsgd39bs/view?usp=share_link
  - Extract the posters from the "posters.zip" file to the path "\web2py\applications\movies\static\" folder.
4) Open command prompt (windows 10) and type the following:
```bash
cd [directory where you extracted the file downloaded in step 1]
cd web2py
python web2py.py
```
5) A web2py Web Framework window will appear.
6) For password, type 'root' or anythng you prefer.
7) A new window will be loaded on your browser of choice.
8) Now, enter this link: http://127.0.0.1:8000/movies/static/htmlindex.html
9) Done! Now you can start using the app as normal users would.
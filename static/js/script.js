let guideSteps = [
  `This is a platform designed to enhance your movie-watching experience. Leveraging advanced algorithms and machine learning techniques, this system provides personalized movie recommendations based on your ratings.

  Whether you're a fan of action-packed thrillers, heartwarming dramas, or laugh-out-loud comedies, this system sifts through thousands of movies to find those that match your unique taste. It's like having a personal movie curator at your fingertips!
  
  This system also features a user-friendly interface with a guided tour to help you navigate through the platform with ease. You can search for movies, browse through our carousel of top picks, and explore our recommendations.
  
  Discover a world of movies tailored just for you. Enjoy curating movies like never before with this IMovie Recommender.`,
  `This is a Panel for accesing the developer's information`,
  "This is the search box. You can type any movie title here to filter out movies and give them a rating.",
  "This is a movie carousel where movies available in the database are displayed and auto-scrolled. This is a feature where in the future versions, a user can interact by clicking on it as can be experienced on Disney+ or Netflix.",
  "This is where movie recommendations will be shown based on what the user rates.",
];

let guideHeading = [
  "The Developer's Panel",
  "The Searching Panel",
  "The Carousel Panel",
  "Movie Recommendations Panel",
];
let clickCount = 0;
let currentStep = 0;
let isBlurred = false;
let pause = false;

var isFetching = false;
let checked = null;

// For loading the option values

let select = document.getElementById("numMovies");
let maxOptions = 500;
let step = 10;
let loadedOptions = 10;

window.onload = function () {
  isBlurred = true;

  // Retrieve
  let checkbox = document.getElementById("checkBox");
  let checked = localStorage.getItem("checked");

  if (checked === null) {
    // First time loading the page
    checkbox.checked = true;
    localStorage.setItem("checked", true);
  } else {
    // Not the first time loading the page
    checkbox.checked = JSON.parse(checked);
  }

  if (checkbox.checked) {
    initializeTourGuide();
  } else {
    resetStyles();
    setTimeout(function () {
      //overlay.style.display = 'none';
      isBlurred = false;
      animateCarousel();
    }, 1000);
  }
  setNoOfRecommendedMovies();

  pauseCarousel(); // will trigger only on click

  handlesettingsPage();

  setTimeout(function () {
    let tourGuide = document.getElementById("tour-guide");
    tourGuide.style.opacity = "1";
  }, 500);

  // Retrieve the watchedMovies object from localStorage
  watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || {};

  fetchMoviesData()
    .then((data) => {
      generateMovieCards(data);
      generateDynamicList(data, watchedMovies);
      checkStoredRatings(watchedMovies);
      displayRatedMovies(watchedMovies);
    })
    .catch((error) => {
      console.error("Error fetching movie data:", error);
    });
};

function initializeTourGuide() {
  isBlurred = true;

  let tourGuide = document.getElementById("tour-guide");
  let guideContent = document.getElementById("guide-content");
  let nextButton = document.getElementById("next-button");
  let overlay = document.getElementById("overlay");
  let tourh2 = document.getElementById("tourHeading");
  guideContent.textContent = guideSteps[currentStep];
  tourGuide.style.display = "block";

  let divs = [
    document.getElementById("leftbar"),
    document.getElementById("search-container"),
    document.getElementById("carousel"),
    document.getElementById("recommendations"),
  ];

  search = document.getElementById("search");

  nextButton.onclick = function () {
    clickCount++;
    currentStep++;
    tourGuide.style.opacity = "0";

    setTimeout(function () {
      // Fade out and move the tour guide

      tourGuide.style.transform = "translateY(-20px)";

      if (clickCount <= 4) {
        if (clickCount === 1) {
          divs[clickCount - 1].style.zIndex = "10000";
          guideContent.textContent = guideSteps[currentStep];
          tourh2.innerHTML = guideHeading[clickCount - 1];
        } else if (clickCount === 2) {
          search.style.boxShadow = "1px 0px 20px 10px white";
          divs[clickCount - 2].style.zIndex = "9999";
          divs[clickCount - 1].style.zIndex = "10000";
          guideContent.textContent = guideSteps[currentStep];
          tourh2.innerHTML = guideHeading[clickCount - 1];
        } else {
          divs[clickCount - 2].style.zIndex = "9999";
          divs[clickCount - 1].style.zIndex = "10000";
          divs[clickCount - 1].style.boxShadow = "1px 0px 20px 10px white";
          guideContent.textContent = guideSteps[currentStep];
          tourh2.innerHTML = guideHeading[clickCount - 1];
        }
        // Get the position of the current div
        let rect = divs[clickCount - 1].getBoundingClientRect();

        // Position the tour guide relative to the current div
        let guideTop = rect.top;
        let guideLeft = rect.left;

        // If it's the third div (recommendations), position the tour guide to the left
        if (clickCount === 3) {
          guideLeft = rect.left - tourGuide.offsetWidth;
        }

        // Check if the tour guide is overflowing the viewport and adjust its position if necessary
        if (guideTop + tourGuide.offsetHeight > window.innerHeight) {
          guideTop = window.innerHeight - tourGuide.offsetHeight;
        }
        if (guideLeft < 0) {
          guideLeft = 0;
        }

        tourGuide.style.top = guideTop + 100 + "px";
        tourGuide.style.left = guideLeft + 100 + "px";

        // Fade in and move the tour guide
        tourGuide.style.opacity = "1";
        tourGuide.style.transform = "translateY(0)";
      } else {
        resetStyles();
        setTimeout(function () {
          overlay.style.display = "none";
          isBlurred = false;
          animateCarousel();
        }, 2100);
      }
    }, 500); // wait for the fade out transition to complete
  };
}

function resetStyles() {
  let tourGuide = document.getElementById("tour-guide");
  let guideContent = document.getElementById("guide-content");
  let nextButton = document.getElementById("next-button");
  let overlay = document.getElementById("overlay");
  let tourh2 = document.getElementById("tourHeading");
  let search = document.getElementById("search");
  let divs = [
    document.getElementById("leftbar"),
    document.getElementById("search-container"),
    document.getElementById("carousel"),
    document.getElementById("recommendations"),
  ];

  // Reset the styles to their original values
  guideContent.textContent = "";
  tourh2.innerHTML = "";
  // Fade out the overlay
  overlay.style.opacity = "0";
  //
  search.style.boxShadow = "";

  tourGuide.style.display = "none";
  divs.forEach(function (div) {
    div.style.zIndex = "";
    div.style.boxShadow = "";
  });
}

function checkStoredRatings(watchedMovies) {
  var recommendationsContent = document.getElementById(
    "recommendations-content"
  );
  // Check if there are any stored ratings
  if (Object.keys(watchedMovies).length === 0) {
    // If there are no stored ratings, show a message asking the user to rate at least one movie
    recommendationsContent.textContent =
      "Please rate at least one movie before getting recommendations";
    recommendationsContent.style.display = "flex";
    recommendationsContent.style.justifyContent = "center";
    recommendationsContent.style.alignItems = "center";
    recommendationsContent.style.color = "red";
    recommendationsContent.style.textShadow = "2px 2px 10px black";
  } else {
    // If there are stored ratings, load the past ratings and show recommendations
    getRecommendations(watchedMovies);
  }
}

// for populating in the searchbox when the user filters movies by typing
function fetchMoviesData() {
  // Return the promise created by fetch
  return fetch("movies.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error; // Re-throw the error to make sure it's caught in the calling code
    });
}

function animateCarousel() {
  const carousel = document.querySelector("#content-wrapper");
  let scrollAmount = 0;
  let scrollSpeed = 2;
  let lastScrollLeft = 0;
  let direction = 1;

  function step() {
    if (!isBlurred) {
      // Only run the animation if the page is not blurred
      carousel.scrollLeft += scrollSpeed * direction;
      scrollAmount += scrollSpeed * direction;
      if (carousel.scrollLeft !== lastScrollLeft) {
        lastScrollLeft = carousel.scrollLeft;
        window.requestAnimationFrame(step);
      }
      if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
        direction = -1;
      } else if (carousel.scrollLeft === 0) {
        direction = 1;
      }
    }
  }
  window.requestAnimationFrame(step);
}

function generateMovieCards(data) {
  let count = 0;
  const content = document.getElementById("content");

  // Loop through each movie in the data
  for (let movie of data) {
    // Stop if we've already displayed 100 movies
    if (count >= 100) break;

    // Only display the movie if the poster attribute is true
    if (movie.poster) {
      // Create a new movie card element
      const movieCard = document.createElement("div");
      movieCard.classList.add("carousel_movie_card");

      // Set the image as the background of the movie card
      movieCard.style.backgroundImage = `url('posters/${movie.movieId}.jpg')`;
      movieCard.style.backgroundSize = "cover"; // Cover the entire area of the movie card
      movieCard.style.backgroundPosition = "center"; // Center the image

      // Create the title element
      const title = document.createElement("h2");
      //title.textContent = movie.title;

      //Append the image and title to the movie card
      movieCard.appendChild(title);

      // Append the movie card to the carousel
      content.appendChild(movieCard);

      // Increment the count
      count++;
    }
  }
}

function generateDynamicList(data, watchedMovies) {
  // Get the search box and create a results list
  const searchBox = document.getElementById("search");
  const resultsContainer = document.createElement("div");
  const resultsList = document.createElement("ul");
  resultsList.classList.add("dynList");

  searchBox.after(resultsContainer);
  resultsContainer.appendChild(searchBox);
  resultsContainer.appendChild(resultsList);

  // Add an input event listener to the search box
  searchBox.addEventListener("input", () => {
    // Clear the current results
    resultsList.innerHTML = "";

    // Get the user's search term and convert it to lower case
    const searchTerm = searchBox.value.toLowerCase();

    if (searchTerm) {
      // Filter the movie data
      const matchingMovies = data.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm)
      );

      // Add the matching movies to the results list
      for (let movie of matchingMovies) {
        const listItem = document.createElement("li");
        listItem.textContent = movie.title;

        // Create a div for the star rating
        const starRating = document.createElement("div");
        starRating.className = "star-rating";

        // Check if the movie has been watched and has a rating
        if (watchedMovies[movie.movieId]) {
          movie.rating = watchedMovies[movie.movieId].rating;
        }

        // Create five stars
        for (let i = 0; i < 5; i++) {
          const star = document.createElement("span");
          star.className = "star";
          star.textContent = i < movie.rating ? "★" : "☆"; // Filled star if i is less than the rating
          starRating.appendChild(star);

          // Add an event listener to each star
          star.addEventListener("mouseover", function () {
            // Highlight all stars up to the one being hovered over
            for (let j = 0; j <= i; j++) {
              starRating.children[j].textContent = "★"; // Filled star
            }

            // Unhighlight all stars after the one being hovered over
            for (let j = i + 1; j < 5; j++) {
              starRating.children[j].textContent = "☆"; // Empty star
            }
          });

          star.addEventListener("mouseout", function () {
            // Reset all stars to their original state
            for (let j = 0; j < 5; j++) {
              starRating.children[j].textContent = j < movie.rating ? "★" : "☆";
            }
          });

          // Add an event listener to each star
          star.addEventListener("click", function () {
            // If the clicked star corresponds to the current rating, unrate the movie
            if (movie.rating === i + 1) {
              movie.rating = 0;
              // Remove the movie from the watchedMovies object if it's unrated
              delete watchedMovies[movie.movieId];
            } else {
              // Otherwise, update the rating for the movie
              movie.rating = i + 1;
              // Add the movie to the watchedMovies object
              watchedMovies[movie.movieId] = {
                movieId: movie.movieId,
                title: movie.title,
                genres: movie.genres,
                poster: movie.poster,
                rating: movie.rating,
              };
              // After rating a movie
              document.getElementById("search").value = "";
              document.getElementsByClassName("dynList")[0].style.display =
                "none";
            }
            displayRatedMovies(watchedMovies);
            // Recalculate the recommendations
            getRecommendations(watchedMovies);

            // Log the watchedMovies object to the console
            console.log("Watched Movies:", watchedMovies);

            // Update the display of the stars
            for (let j = 0; j < 5; j++) {
              if (j < movie.rating) {
                starRating.children[j].textContent = "★"; // Filled star
                // Store the watchedMovies object in localStorage
                localStorage.setItem(
                  "watchedMovies",
                  JSON.stringify(watchedMovies)
                );
              } else {
                starRating.children[j].textContent = "☆"; // Empty star
              }
            }

            // Update the watchedMovies object in localStorage
            localStorage.setItem(
              "watchedMovies",
              JSON.stringify(watchedMovies)
            );
          });
        }

        // Append the star rating to the list item
        listItem.appendChild(starRating);

        resultsList.appendChild(listItem);
      }
      // Show the results list
      resultsList.style.display = "block";
    } else {
      // If the search box is empty, hide the results list
      resultsList.style.display = "none";
    }
  });

  // Add a keydown event listener to the document
  document.addEventListener("keydown", function (event) {
    // If the key pressed was the escape key
    if (event.key === "Escape") {
      // Hide the dynamic list
      resultsList.style.display = "none";
    }
  });

  // Add a click event listener to the document
  document.addEventListener("click", function (event) {
    // If the click was not inside the dynamic list or the search box
    if (
      !resultsList.contains(event.target) &&
      !searchBox.contains(event.target)
    ) {
      // Hide the dynamic list
      resultsList.style.display = "none";
    }
  });
}

function getRecommendations(watchedMovies) {
  var recommendationsDiv = document.getElementById("recommendations");
  var recommendationsContent = document.getElementById(
    "recommendations-content"
  );

  // Clear the existing recommendations
  while (recommendationsContent.firstChild) {
    recommendationsContent.removeChild(recommendationsContent.firstChild);
  }

  // Create a loading spinner and a label if they don't exist yet
  var loadingSpinner = document.querySelector(".spinner");
  var loadingLabel = document.querySelector(".loading-label");

  if (!loadingSpinner) {
    loadingSpinner = document.createElement("div");
    loadingSpinner.className = "spinner"; // Add your spinner CSS class here
    recommendationsContent.appendChild(loadingSpinner);
  }
  if (!loadingLabel) {
    loadingLabel = document.createElement("p");
    loadingLabel.className = "loading-label";
    loadingLabel.textContent = "Loading recommendations";
    recommendationsContent.appendChild(loadingLabel);
  }

  // Show the spinner and label
  loadingSpinner.style.display = "block"; // Or whatever the original display value was
  loadingLabel.style.display = "block"; // Or whatever the original display value was

  // Make the recommendationsContent div a relative positioned container
  recommendationsContent.style.position = "relative";

  // Position the spinner and label absolutely in the center of the recommendationsContent div
  loadingSpinner.style.position = "absolute";
  loadingSpinner.style.top = "20%";
  loadingSpinner.style.left = "calc(25%+ 5px)";
  loadingSpinner.style.zIndex = "1000"; // Ensure the spinner appears above the movie cards

  loadingLabel.style.position = "absolute";
  loadingLabel.style.top = "calc(38% + 70px)";
  loadingLabel.style.left = "calc(50% + 5px)";
  loadingLabel.style.transform = "translate(-50%, -50%)";
  loadingLabel.style.zIndex = "1000"; // Ensure the spinner appears above the movie cards

  // Apply a filter to the movie cards
  var movieCards = document.querySelectorAll(".recommended_movie_card");
  movieCards.forEach((movieCard) => {
    movieCard.style.filter = "blur(5px) brightness(50%)"; // Blur and darken the movie cards
  });

  let select = document.getElementById("numMovies");
  let numMovies = localStorage.getItem("numMovies")
    ? Number(localStorage.getItem("numMovies"))
    : Number(select.value);

  fetch("/movies/default/call/json/get_recommendations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      watched_movies: watchedMovies,
      num_movies: numMovies,
    }),
  })
    .then((response) => response.json())
    .then((recommendedMovies) => {
      let movieCount = document.getElementById("movie-count");
      // If there are no watched movies, display a message asking the user to rate at least one movie
      if (Object.keys(watchedMovies).length === 0) {
        hideSpinner(loadingSpinner, loadingLabel);
        var message = document.createElement("p");
        message.textContent =
          "Please rate at least one movie to get possible recommendations.";
        recommendationsContent.appendChild(message);
        movieCount.textContent = "No movies to show";

        recommendationsContent.style.display = "flex";
        recommendationsContent.style.justifyContent = "center";
        recommendationsContent.style.alignItems = "center";
        recommendationsContent.style.color = "red";
        recommendationsContent.style.textShadow = "2px 2px 10px black";
      }
      // If there are no recommended movies, display a message saying there are no recommendations for now
      else if (Object.keys(recommendedMovies).length === 0) {
        hideSpinner(loadingSpinner, loadingLabel);
        var message = document.createElement("p");
        message.textContent = "No Recommendations for now.";
        recommendationsContent.appendChild(message);
        movieCount.textContent = "No movies to show";
      } else {
        // Create a container for the movie cards
        const cardsDiv = document.createElement("div");
        cardsDiv.className = "cards";

        // Iterate over each recommended movie and create the movie cards
        var movieCardPromises = recommendedMovies.map((movie) => {
          // Create the movie card
          return createMovieCard(movie);
        });

        Promise.all(movieCardPromises).then((movieCards) => {
          // Append the movie cards to the cards container
          movieCards.forEach((movieCard) => {
            cardsDiv.appendChild(movieCard);
          });

          // Append the cards container to the recommendations content
          recommendationsContent.appendChild(cardsDiv);

          hideSpinner(loadingSpinner, loadingLabel);

          // Remove the filter from the movie cards
          movieCards.forEach((movieCard) => {
            movieCard.style.filter = "none"; // Remove the blur and brightness filter
          });

          // After rendering the movies, count them and update the movie-count div
          movieCount.textContent = "Showing " + movieCards.length + " movies";
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // Function to create a movie card
  function createMovieCard(movie) {
    // Create the movie card div
    const movieCard = document.createElement("div");
    movieCard.classList.add("recommended_movie_card");

    // Create the poster div
    const poster = document.createElement("div");
    poster.className = "poster";
    poster.style.backgroundColor = "darkgrey";

    // Fetch the movie poster and set it as the background of the poster div
    return checkMovieAndPoster(movie).then((result) => {
      if (result && result.poster) {
        poster.style.backgroundImage = `url('posters/${result.movieId}.jpg')`;
      }
      poster.style.backgroundSize = "cover";
      poster.style.backgroundPosition = "center";

      // Create the movie title div
      const movieTitle = document.createElement("div");
      movieTitle.className = "recommended_movie_card_title";
      movieTitle.textContent = movie;

      // Append the poster and movie title divs to the movie card
      movieCard.appendChild(poster);
      movieCard.appendChild(movieTitle);

      return movieCard;
    });
  }
}

function updateMovieCountLabel() {
  let recommendationsContent = document.getElementById(
    "recommendations-content"
  );
  let movieCount = document.getElementById("movie-count");

  if (recommendationsContent.innerHTML.trim() === "") {
    // If the recommendations-content div is empty, hide the movie-count div
    movieCount.style.display = "none";
  } else {
    // If the recommendations-content div is not empty, show the movie-count div and update the movie count
    movieCount.style.display = "block";
    let movieCards = document.querySelectorAll(".movie-card");
    movieCount.textContent = "Showing " + movieCards.length + " movies";
  }
}

function hideSpinner(loadingSpinner, loadingLabel) {
  // Hide the spinner and label and reset them to their original state
  loadingSpinner.style.display = "none";
  loadingLabel.style.display = "none";
  loadingSpinner.style.position = "static";
  loadingSpinner.style.transform = "none";
  loadingSpinner.style.backgroundColor = "transparent";
  loadingLabel.style.position = "static";
  loadingLabel.style.transform = "none";
  loadingLabel.style.backgroundColor = "transparent";
}

function checkMovieAndPoster(movieTitle) {
  return fetch("movies.json")
    .then((response) => response.json())
    .then((movies) => {
      // Find the movie in the movies array
      const movie = movies.find((movie) => movie.title === movieTitle);

      // If the movie was found
      if (movie) {
        // Return the movieId and poster attributes
        return { movieId: movie.movieId, poster: movie.poster };
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
}

function displayRatedMovies(watchedMovies) {
  var watchedMoviesArray = Object.values(watchedMovies);
  // Get the #tags element
  var tagsElement = document.getElementById("tags");

  // Clear the #tags element
  tagsElement.innerHTML = "";

  // Create a tag for each rated movie
  watchedMoviesArray.forEach(function (movie) {
    let tag = document.createElement("div");
    tag.className = "tag";

    let title = document.createElement("span");
    title.textContent = movie.title;
    tag.appendChild(title);

    let rating = document.createElement("div");
    rating.textContent = "⭐".repeat(movie.rating);
    tag.appendChild(rating);

    let deleteIcon = document.createElement("span");
    deleteIcon.textContent = "❌";
    deleteIcon.title = "Clear Rating";
    deleteIcon.onclick = function () {
      // Remove the movie from the watchedMovies object
      delete watchedMovies[movie.movieId];
      localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies));
      getRecommendations(watchedMovies);
      // Redisplay the rated movies
      displayRatedMovies(watchedMovies);

      // Clear the rating of the movie in the dynamic list
      setTimeout(() => clearRatingInDynamicList(movie.title), 0);
    };
    tag.appendChild(deleteIcon);

    // Append the tag to the #tags element
    tagsElement.appendChild(tag);
  });
}

function clearRatingInDynamicList(movieTitle) {
  // Get the dynamic list
  const dynamicList = document.querySelector(".dynList");

  // Get all list items in the dynamic list
  const listItems = dynamicList.querySelectorAll("li");

  // Iterate over each list item in the dynamic list
  for (let i = 0; i < listItems.length; i++) {
    // Check if the list item corresponds to the movie
    if (listItems[i].firstChild.textContent === movieTitle) {
      // Get the star rating div from the list item
      const starRating = listItems[i].querySelector(".star-rating");

      // Clear the stars
      for (let j = 0; j < 5; j++) {
        starRating.children[j].textContent = "☆"; // Empty star
      }

      // Break the loop
      break;
    }
  }
}

function pauseCarousel() {
  document
    .getElementById("carousel-control")
    .addEventListener("click", function () {
      isBlurred = !isBlurred;
      if (isBlurred) {
        // If the carousel is paused, resume it
        this.className = "fas fa-play";
      } else {
        // If the carousel is running, pause it
        this.className = "fas fa-pause";
        animateCarousel();
      }
    });
}

function handlesettingsPage() {
  // Create the message div
  let messageDiv = document.createElement("div");
  messageDiv.textContent = "To apply changes close the settings page.";
  messageDiv.style.display = "none";

  // Get the elements
  let overlay = document.getElementById("overlay");
  let settings = document.getElementById("settings");

  document.getElementById("close").addEventListener("click", closeSettings);

  // Close the settings window
  function closeSettings() {
    settings.classList.remove("open");
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.2s ease-in-out";
    messageDiv.style.display = "none";

    // If any changes have been made, reload the page
    if (settingsChanged) {
      location.reload();
    }
  }

  // Event listener for the Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeSettings();
    }
  });

  document
    .getElementById("settingsIcon")
    .addEventListener("click", function () {
      overlay.style.opacity = "0.9";
      overlay.style.transition = "opacity 0.2s ease-in-out";
      document.getElementById("settings").classList.add("open");
      settings.style.zIndex = "10000";
    });

  document.getElementById("checkBox").addEventListener("change", function () {
    // Store
    localStorage.setItem("checked", JSON.stringify(this.checked));
  });

  loadOptions();

  // Apply some CSS to make the message transparent and green
  messageDiv.style.backgroundColor = "rgba(0, 255, 0, 0.5)"; // Semi-transparent green
  messageDiv.style.color = "white"; // White text
  messageDiv.style.padding = "10px"; // Some padding
  messageDiv.style.marginTop = "10px"; // Some margin at the top

  // Append the message div to the seetborder div
  let settborderDiv = document.getElementById("settborder");
  settborderDiv.appendChild(messageDiv);

  // Get the select dropdown and toggle switch elements
  let select = document.querySelector("#numMovies");
  let toggle = document.querySelector("#checkBox");

  // Create an array with the select dropdown and toggle switch
  let inputs = [select, toggle];
  // Flag to track if any changes have been made
  let settingsChanged = false;

  // Listen for change events on the select dropdown and toggle switch
  inputs.forEach((input) => {
    input.addEventListener("change", function () {
      // When a change event is fired, show the message div
      messageDiv.style.display = "block";
      settingsChanged = true;
    });
  });

  // Get the close button
  let closeButton = document.querySelector("#close");

  // Add a click event listener to the close button
  closeButton.addEventListener("click", closeSettings);
}

function loadOptions() {
  for (
    let i = loadedOptions;
    i <= loadedOptions + 490 && i <= maxOptions;
    i += step
  ) {
    let option = document.createElement("option");
    option.value = i;
    option.text = i;
    select.appendChild(option);
  }
  loadedOptions += 100;
  // After the select box is populated, set the value
  let numMovies = localStorage.getItem("numMovies");
  if (numMovies) {
    select.value = numMovies;
  } else select.value = "10";
}

function setNoOfRecommendedMovies() {
  let numMovies = localStorage.getItem("numMovies");
  let select = document.getElementById("numMovies");

  if (numMovies) {
    select.value = numMovies;
  } else {
    localStorage.setItem("numMovies", select.value);
  }
  select.addEventListener("change", function () {
    localStorage.setItem("numMovies", this.value);
  });
}

const imdbApiKey = "k_r3l9iugp"; // imdb API Key ** USE YOUR OWN KEY **
//  k_r3l9iugp
// my maxxed out key: k_s32r3njw
const tmdbApiKey = "544c4fb756174d83537dbb29a9037cd3"; // tmdb API Key ** USE YOUR OWN KEY **

movieTitleEl = document.querySelector("#movieTitle");
ratingEl = document.querySelector("#imdbRating"); 
moviePlotEl = document.querySelector("#moviePlot"); 
moviePosterEl = document.querySelector("#moviePoster");
// streaming services icons
netflixEl = document.querySelector("#netflix");
primeEl = document.querySelector("#prime");
huluEl = document.querySelector("#hulu");
hboEl = document.querySelector("#hbo");

// Initialize the streaming service buttons to disabled until API is queried
netflixEl.disabled = true;
primeEl.disabled = true;
huluEl.disabled = true;

function callIMDBApi (queryString) { //imdb API call with a user-inputted movie title as the query
    var ApiUrl = `https://imdb-api.com/en/API/AdvancedSearch/${imdbApiKey}/?title=` + queryString;

    fetch(ApiUrl) 
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            //Stores each needed piece of data into a var and an array
            let imdbMovieID = data.results[0].id;
            let imdbMovieTitle = data.results[0].title;
            let imdbRating = data.results[0].imDbRating;
            let imdbPlot = data.results[0].plot;
            let imdbPoster = data.results[0].image;

            let movieData = [imdbMovieID,imdbMovieTitle,imdbRating,imdbPlot,imdbPoster];

            //Stores this movie as a recent search
            let recentSearches =[];

            //GETS local storage
            if(localStorage["recentSearches"]) {
              recentSearches = JSON.parse(localStorage["recentSearches"]);
            }

            //Sets local storage - only updates if new movie is unique to the list
            if(recentSearches.indexOf(imdbMovieTitle) == -1) {
              recentSearches.unshift(imdbMovieTitle);
              if(recentSearches.length > 5) { 
                 recentSearches.pop();
              }
              localStorage["recentSearches"] = JSON.stringify(recentSearches);
            }

            // Replace placeholder text with info from the API
            document.title = movieData[1];
            movieTitleEl.textContent = movieData[1];
            ratingEl.textContent = movieData[2];
            moviePlotEl.textContent = movieData[3];
            moviePosterEl.setAttribute("src", movieData[4]);

            //Determine what color background the imDB rating should have
            if (ratingEl.textContent > 7.5) {
              ratingEl.style.backgroundColor  ="green";
            }
            else if (ratingEl.textContent < 7.5 && ratingEl.textContent > 5.0) {
              ratingEl.style.backgroundColor  = "#8B8000";
            }
            else {
              ratingEl.style.backgroundColor  ="red";
            }
            
           callTMDBApi(imdbMovieID); // call the API refering to the queried movie's ID
          });
        } else { // 'unable to find movie title'
          alert('Error: ' + response.statusText);
        }
      })
    .catch(err => console.error(err)); // 'API call failed'
};


function callTMDBApi (movieID) { //GETs the movies tmdbID using the imdbMovieID from the previous API call - needed for the streaming info fetchURL
  tmdbExternalURL = `https://api.themoviedb.org/3/find/${movieID}?api_key=${tmdbApiKey}&language=en-US&external_source=imdb_id`;

  let tmdbID;
  fetch(tmdbExternalURL) 
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
        tmdbID = data.movie_results[0].id; //Just takes first result's ID
        callWatchProviderApi(tmdbID);
  });
  } else {
    alert('Error: ' + response.statusText);
  }})
  .catch(err => console.error(err));
}

function callWatchProviderApi (tmdbID) { //GETs the service providers of the queried movie and stores their names in an array
  let watchProviderURL = `https://api.themoviedb.org/3/movie/${tmdbID}/watch/providers?api_key=${tmdbApiKey}`;
  let watchProvidersObjectList;
 
  fetch(watchProviderURL) 
  .then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
      watchProvidersObjectList = data.results.US.flatrate; // stores all streaming service info into array of objects
      console.log(watchProvidersObjectList);
      //Checks each supported watch provider and enables their button if the API says they support the movie
      for (var i =0; i < watchProvidersObjectList.length; i++) {
        if (watchProvidersObjectList[i].provider_name == "Netflix")
        {
            netflixEl.disabled = false;
        }
        if (watchProvidersObjectList[i].provider_name == "Amazon Prime Video")
        {
            primeEl.disabled = false;
        }
        if (watchProvidersObjectList[i].provider_name == "Hulu")
        {
            huluEl.disabled = false;
        }
        if (watchProvidersObjectList[i].provider_name == "HBO Max")
        {
            hboEl.disabled = false;
        }
    }
    });
  } else {
    alert('Error: ' + response.statusText);
  }})
    .catch(err => console.error(err));
}

queryString = window.location.search;
queryString = queryString.split('?title=')[1];

callIMDBApi(queryString);
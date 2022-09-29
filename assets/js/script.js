searchInput = document.querySelector("#searchBar"); //text input from user
searchButton = document.querySelector("#searchButton"); // search button


const imdbApiKey = "k_s32r3njw"; // imdb API Key ** USE YOUR OWN KEY **

const tmdbApiKey = "544c4fb756174d83537dbb29a9037cd3"; // tmdb API Key ** USE YOUR OWN KEY **


searchInput.value = "inception"; //FOR EXAMPLE USE ONLY - user will input their own value



function callIMDBApi (event) { //imdb API call with a user-inputted movie title as the query
    event.preventDefault();
    //console.log("button clicked"); //use to make sure function is firing if API takes a moment to display

    var apiUrl = `https://imdb-api.com/en/API/AdvancedSearch/${imdbApiKey}/?title=` + searchInput.value;

    fetch(apiUrl) 
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data.results);
            
            // TODO: if "null"; this request will time out - create a function to resend request - or wait?
            // TODO: This only takes in the first results info (data.results[0]), change to store ALL data.results[x] - 
            // in an Array of Arrays? for results.html
            /** 
            let imdbMovieID = data.results[0].id;
            let imdbMovieTitle = data.results[0].title;
            let imdbRating = data.results[0].imDbRating;
            let imdbPlot = data.results[0].plot;
            let imdbPoster = data.results[0].image;

            let movieData = [imdbMovieID,imdbMovieTitle,imdbRating,imdbPlot,imdbPoster];

            *** GET ALL ***
            let movieData = {imdbMovieID,imdbMovieTitle,imdbRating,imdbPlot,imdbPoster}; //store all arrays as one big object?

            */

            //Get the IDs, Titles, Ratings, Plots and Posters for each returned movie result
            // TODO: Display on the html page 
            let imdbMovieIDs = [];
            let imdbMovieTitles = [];
            let imdbRatings = [];
            let imdbPlots = [];
            let imdbPosters = [];
 
            for (var i =0; i < data.results.length; i++) {
              imdbMovieIDs[i] = data.results[i].id;
              imdbMovieTitles[i] = data.results[i].title;
              imdbRatings[i] = data.results[i].imDbRating;
              imdbPlots[i] = data.results[i].plot;
              imdbPosters[i] = data.results[i].image;
            }

            console.log(imdbMovieIDs);
            console.log(imdbMovieTitles);
            console.log(imdbRatings);
            console.log(imdbPlots);
            console.log(imdbPosters);

            //console.log(movieData);
            
            //call the TMDB API with movieData as a parameter to connect between the TMDB API and IMDB API's
            //only uses movieData[0] at the moment (imdbMovieID) - use the others to populate displayPage.html 

           // callTMDBApi(movieArray[event.target]); // call the API refering to the clicked on movie's ID

          });
        } else { // 'unable to find movie title'
          alert('Error: ' + response.statusText);
        }
      })
      .catch(err => console.error(err)); // 'API call failed'
};


function callTMDBApi (movieData) { //GETs the movies tmdbID using the imdbMovieID from the previous API call - needed for the streaming info fetchURL
  //console.log("tmdb external source call");
  tmdbExternalURL = `https://api.themoviedb.org/3/find/${movieData[0]}?api_key=${tmdbApiKey}&language=en-US&external_source=imdb_id`;

  let tmdbID;
  fetch(tmdbExternalURL) 
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
        tmdbID = data.movie_results[0].id; //just takes first result's ID
        callWatchProviderApi(tmdbID);
  });
  } else {
    alert('Error: ' + response.statusText);
  }})
  .catch(err => console.error(err));
}

function callWatchProviderApi (tmdbID) { //GETs the service providers of the queried movie and stores their names in an array
  // console.log("watch provider call");
  let watchProviderURL = `https://api.themoviedb.org/3/movie/${tmdbID}/watch/providers?api_key=${tmdbApiKey}`;
  let watchProvidersObjectList;
  let watchProvidersArray =[];
 

  fetch(watchProviderURL) 
  .then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
      watchProvidersObjectList = data.results.CA.flatrate; // stores all streaming service info into array of objects
      //console.log(watchProvidersObjectList);
      
      for (var i =0; i < watchProvidersObjectList.length; i++) {
        watchProvidersArray[i] = watchProvidersObjectList[i].provider_name; //isolates for and stores the name of the streaming services
      }
    //console.log(watchProvidersArray);
     
    });
  } else {
    alert('Error: ' + response.statusText);
  }})
    .catch(err => console.error(err));
}



searchButton.addEventListener("click", callIMDBApi); //fetch imdb API data on button click

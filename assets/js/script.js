searchInput = document.querySelector("#searchBar"); //text input from user
searchButton = document.querySelector("#searchButton"); // search button


const ApiKey = "k_s32r3njw"; // imdb API Key


/* PSEUDO-CODE
this file will add functionality to index.html
it will store the user's input (a movie title) in searchInput (when searchButton is clicked)
and then query the APIs with that movie Title


# APIs USED
https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability/ --Streaming services info

https://imdb-api.com/api#Title-header -- Movie Info

addEventListener() -> fetch()
*/
searchInput.value = "inception"; //FOR EXAMPLE USE ONLY - user will input their own value



function callApi (event) {
    event.preventDefault();
    console.log("button clicked");


    var apiUrl = `https://imdb-api.com/en/API/SearchMovie/${ApiKey}/` + searchInput.value;

    console.log(apiUrl);

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          //displayRepos(data, user);
          // data will contain an array of matching movie titles
          console.log(data);
        });
      } else { // 'unable to find movie title'
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) { //unable to connect to imdb
      //alert('Unable to connect to GitHub');
    });
}

searchButton.addEventListener("click", callApi); //fetch API data on button click
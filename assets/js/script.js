searchInput = document.querySelector("#searchBar"); //text input from user
searchButton = document.querySelector("#searchButton"); // search button

searchInput.value = "inception"; //default

function createQueryString(event) {
  event.preventDefault();
  queryString = searchInput.value;
  location.href = "./displayPage.html?title=" + queryString;
}

searchButton.addEventListener("click", createQueryString); //fetch imdb API data on button click

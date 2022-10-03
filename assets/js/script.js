searchInput = document.querySelector("#searchBar"); //text input from user
searchButton = document.querySelector("#searchButton"); // search button
recentSearchesEl = document.querySelector("#searches")

function createQueryString(event) {
  event.preventDefault();
  queryString = searchInput.value;
  location.href = "./displayPage.html?title=" + queryString;
}

var recentSearches = [];

if(localStorage["recentSearches"]) {
  var ul = document.getElementById("list");
  var li = document.createElement("li");

  recentSearches = JSON.parse(localStorage["recentSearches"]);
  
  for (var i =0; i < recentSearches.length;i++) {
    
    var a = document.createElement("a");
    
    a.textContent = recentSearches[i];
    a.setAttribute('href', "./displayPage.html?title=" +recentSearches[i]);

    li.appendChild(a);

    li.style.padding = "5px";
    li.style.margin = "5px";
    li.style.backgroundColor = "grey";

    ul.appendChild(li);
    li = document.createElement("li");
  }
}

searchButton.addEventListener("click", createQueryString); //fetch imdb API data on button click

searchInput.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById(searchButton).click();
    }
});
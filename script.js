const apiKey = '7e3f5c8edbd443dbdf76067d9d149d05'

const form = document.getElementById("my-form")
const formResponse = document.getElementById("search-input")
const closeButton = document.getElementById("close-search-btn")

form.addEventListener('submit', handleFormSubmit)

let currPage = 1
let currPageSearch = 1
let isSearch = false

async function getMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${currPage}`)
    const jsonResponse = await response.json();
    return jsonResponse["results"];
}

async function handleFormSubmit(event) {
    event.preventDefault();
    closeButton.style.display = "grid";
    movieGridElement.style.display = "none";
    currPageSearch = 1
    searchGridElement.innerHTML = ""
    isSearch = true;
    displayResultsSearch()
}


async function displayResults(event) {
    const movies = await getMovies();
    movies.forEach(displayMovie)
}

async function displayResultsSearch(event) {
    let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${formResponse.value}&page=${currPageSearch}&include_adult=false`)
    const jsonResponse = await response.json();
    const movies = await jsonResponse["results"]
    movies.forEach(displayMovieSearch)
}

const movieGridElement = document.querySelector('#movie-grid')
const searchGridElement = document.querySelector("#search-grid")

function displayMovie(movie) {
    movieGridElement.innerHTML = movieGridElement.innerHTML + `
    <div class = "movie-card">
        <img class = "movie-poster" src = "https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="" />
        <p> 
            ${movie.title}
        </p>
        <p>
            Rating: ${movie.vote_average}
        </p>
    </div>
    `  
}


function displayMovieSearch(movie) {
    searchGridElement.innerHTML = searchGridElement.innerHTML + `
    <div class = "movie-card">
        <img class = "movie-poster" src = "https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="" />
        <p> 
            ${movie.title}
        </p>
        <p id = "movie-votes">
            Rating: ${movie.vote_average}
        </p>
    </div>
    `
}


function loadMore() {
    if (!isSearch) {
        currPage = currPage + 1;
        displayResults()
    } else {
        currPageSearch = currPageSearch + 1;
        displayResultsSearch()
    }
}


async function closeSearch() {
    movieGridElement.style.display = "grid";
    searchGridElement.innerHTML = ""
    closeButton.style.display = "none";
    isSearch = false
}

// displayResults()
window.onload = function () {
    closeButton.style.display = "none";
    displayResults()
    displayResultsSearch()
}



const apiKey = '7e3f5c8edbd443dbdf76067d9d149d05'

const form = document.getElementById("my-form")
const formResponse = document.getElementById("search-input")
const closeButton = document.getElementById("close-search-btn")
const popupCloseButton = document.getElementById("close-popup-btn")

const movieGridElement = document.querySelector('#movie-grid')
const searchGridElement = document.querySelector("#search-grid")
const popupElement = document.querySelector('#popup')

const trailerElement = document.querySelector('#open-trailer-btn')




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


function displayMovie(movie) {

    movieGridElement.innerHTML = movieGridElement.innerHTML + `
    <div class = "movie-card">
        <img class = "movie-poster" src = "https://image.tmdb.org/t/p/w500${movie.poster_path}"  onclick="popupFunction('${movie.id}')" alt="" />
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
        <img class = "movie-poster" src = "https://image.tmdb.org/t/p/w500${movie.poster_path}" onclick="popupFunction('${movie.id}')" alt="" />
        <p> 
            ${movie.title}
        </p>
        <p id = "movie-votes">
            Rating: ${movie.vote_average}
        </p>
    </div>
    `
}

async function popupFunction(id) {
    let response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`)
    let movie = await response.json()
    
    popupElement.style.display = "grid";
    popupElement.innerHTML = popupElement.innerHTML + `
    <div id = "popup-card">
        <img id = "movie-backdrop" src = "https://image.tmdb.org/t/p/w500${movie.backdrop_path}" alt="" />
        <p> 
            ${movie.title}
        </p>
        <p>
            Budget: $${movie.budget} | Revenue: $${movie.revenue} | Runtime: ${movie.runtime} min

        </p>
        <p>
            ${movie.overview}
        </p>

        <div class="movie-trailer-wrapper">
            <button id='open-trailer-btn' onclick="openTrailer(${id})">Watch Trailer!</button>
        </div>

        <div class="popup-close">
            <button id='close-popup-btn' onclick="closePopup()">Close</button>
        </div>

    </div>
    `
    console.log("actually reached")
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

async function closePopup() {
    popupElement.style.display = "none";
    popupElement.innerHTML = "";
}

async function openTrailer(id) {
    const popupCardElement = document.querySelector("#popup-card")
    console.log(id)
    let response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`)
    let videoJson = await response.json()
    let video = videoJson.results
    let youtubeID = ""
    video.forEach(element => {
        if (element["type"] === "Trailer") {
            youtubeID = element["key"]
        }
    });
    console.log(youtubeID)
    let trailer = document.createElement("iframe"); 
    trailer.width = 560; 
    trailer.height = 315; 
    trailer.src = `https://www.youtube.com/embed/${youtubeID}`
    trailer.frameborder = "0"
    trailer.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"

    let backdrop = document.getElementById("movie-backdrop")
    console.log(popupCardElement)
    console.log(backdrop)
    popupCardElement.replaceChild(trailer, backdrop)

}

// displayResults()
window.onload = function () {
    closeButton.style.display = "none";
    displayResults()
}



'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=6de312bb1131d8c5991b62ffbdfc1830`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  CONTAINER.innerHTML = "";
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row");

  movies.map((movie) => {
    const colDiv = document.createElement("div");
    colDiv.classList.add("col-12");
    colDiv.classList.add("col-md-6");
    colDiv.classList.add("col-lg-4");

    const movieDiv = document.createElement("div");
    movieDiv.classList.add("card");
    if (movie.backdrop_path !== null){
      movieDiv.innerHTML = `
      <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster" class="card-img-top">
      <div class="card-body">
        <h3 class="card-title text-center">${movie.title}</h3>
      </div>
    `;
    }
     
    // console.log(movie)
   

    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });

    colDiv.appendChild(movieDiv);
    rowDiv.appendChild(colDiv);
  });

  
  CONTAINER.appendChild(rowDiv);
  
};
// function renderMovieFromSearch(movies){
//   CONTAINER.innerHTML = ""
//   movies.map((movie) => {
//     if(movie.backdrop_path !== null){
//       const movieDiv = document.createElement("div");
//       movieDiv.innerHTML = ""
//       if (movie.media_type === "movie"){
//         movieDiv.innerHTML = `
//         <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title
//           } poster">
//         <h3>${movie.title}</h3>`;
//       } else if (movie.media_type === "tv"){
//         movieDiv.innerHTML = `
//         <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title
//           } poster">
//         <h3>${movie.name}</h3>`;
//       }
      

//       movieDiv.addEventListener("click", () => {
//         movieDetails(movie);
//       });
//       CONTAINER.appendChild(movieDiv);
//     }
    


//   });
// }


// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${PROFILE_BASE_URL + movie.poster_path

             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};


//search function 
const search = document.getElementById("search")
search.onkeyup = (e)=>{
  searchInput(e.target.value)
}

function searchInput(value) {
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=6de312bb1131d8c5991b62ffbdfc1830&language=en-US&query=${value}&page=1&include_adult=false`)
    .then(response => response.json())
    // .then(data => console.log(data.results))
    .then(data => renderMovies(data.results))
    .catch(err => console.error(err));
}

//fetch genre



document.addEventListener("DOMContentLoaded", autorun);


// codes by Izdihar dropdown part
const filterDropdown = document.getElementById('filter'); 
const filterButton = document.getElementById('filter-btn')

filterButton.addEventListener('click', () => {
  filterDropdown.style.display = 'block';
});

filterDropdown.addEventListener('mouseleave', () => {
  filterDropdown.style.display = 'none';
});

//search function 
const input = document.getElementById("search")
input.onkeyup = (e)=>{
  searchInput(e.target.value)
}

function searchInput(value) {
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=6de312bb1131d8c5991b62ffbdfc1830&language=en-US&query=${value}&page=1&include_adult=false`)
    .then(response => response.json())
    // .then(data => console.log(data.results))
    .then(data => renderMovies(data.results))
    .catch(err => console.error(err));
}

//fetching genre here !!!
const genreUl = document.querySelector("#genre")
function getGenere() {
  const url = constructUrl('genre/movie/list')
  fetch(url)
    .then(res => res.json())
    .then(data => createGenreItme(data.genres))
}
function createGenreItme(itme){
     itme.forEach(el => {
      const genreItme = document.createElement('li')
      genreItme.textContent = el.name
      genreItme.classList.add('genre')
      genreUl.appendChild(genreItme)

      genreItme.addEventListener("click", () => {
        const url = constructUrl('discover/movie') + `&with_genres=${el.id}`
        fetch(url)
          .then(resp => resp.json())
          .then(data => renderMovies(data.results))
      })
     
    })
}
getGenere()


// filter dropdown

// const nowPlayingMovies = document.getElementById('now-playing')
// const upComingMovies = document.getElementById('up-coming')
// const popularMovies = document.getElementById('popular')
// const topRatedMovies = document.getElementById('top-rated')

const filter = document.querySelectorAll('.filter'); // Error: filter is a NodeList, not an array
console.log(filter);
filter.forEach(element => { // Error: filter.forEach is not a function
  element.addEventListener('click', () => {
   
    if (element.textContent === 'Now playing') {
      fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=6de312bb1131d8c5991b62ffbdfc1830')
      .then(response => response.json())
      .then(json => renderMovies(json.results))
   } else if (element.textContent === 'Popular'){
    fetch('https://api.themoviedb.org/3/movie/popular?api_key=6de312bb1131d8c5991b62ffbdfc1830')
    .then(response => response.json())
    .then(json => renderMovies(json.results))
   } 
  })
})




 
// Event handler for the "Now playing" filter
function NowPlaying() {
  const value = 'now-playing';
  redirectToMovieSearch(value);
}

// Event handler for the "Upcoming" filter
function upcoming() {
  const value = 'up-coming';
  redirectToMovieSearch(value);
}

// Event handler for the "Popular" filter
function popular() {
  const value = 'popular';
  redirectToMovieSearch(value);
}

// Event handler for the "Top rated" filter
function toprated() {
  const value = 'top-rated';
  redirectToMovieSearch(value);
}

// Redirect function
function redirectToMovieSearch(value) {
  const baseUrl = 'https://api.themoviedb.org/3/search/movie';
  const apiKey = '6de312bb1131d8c5991b62ffbdfc1830';
  const language = 'en-US';
  const page = 1;
  const includeAdult = false;

  const url = `${baseUrl}?api_key=${apiKey}&language=${language}&query=${value}&page=${page}&include_adult=${includeAdult}`;

 window.location.href = url;
}


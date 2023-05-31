'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");


// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  const idRes = await fetchMovie(movies.results.map(result => result.id))
  renderMovies(movies.results, idRes);

};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=6de312bb1131d8c5991b62ffbdfc1830`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const videosRes = await videos(movie.id);
  const similarRes = await similarMoveies(movie.id)
  const castRes = await cast(movie.id)
  renderMovie(movieRes, videosRes, similarRes, castRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`trending/movie/week`);
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
const renderMovies = (movies,ID) => {
  CONTAINER.innerHTML = "";
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row");


  movies.forEach((movie) => {
    if (movie.backdrop_path !== null) {
      const colDiv = document.createElement("div");
      colDiv.classList.add("col-12");
      colDiv.classList.add("col-md-6");
      colDiv.classList.add("col-lg-4");
      colDiv.id = 'card'

      const movieDiv = document.createElement("div");
      movieDiv.classList.add("card");

      movieDiv.innerHTML = `
      <img src="${BACKDROP_BASE_URL + movie.poster_path}" alt="${movie.title} poster" class="card-img-top height="300px"" >
      <div class="card-body">
        <h3 class="card-title align-self-start text-dark">GENRES :</h3>
        <p class="cardText">${ID.genres.map(genre => ` ${genre.name} `)}</p>
        <p  class = "card-title text-dark" > RATEING :</p>
        <div class="progress">
  <div class="progress-bar bg-warning" role="progressbar" style="width:${(movie.vote_average * 10).toFixed(0)}%" aria-valuenow="${(movie.vote_average * 10).toFixed(0)}" aria-valuemin="0" aria-valuemax="100">${(movie.vote_average * 10).toFixed(0)} %</div>
</div>
      </div>
    `;
      movieDiv.addEventListener("click", () => {
        movieDetails(movie);
      });
      movieDiv.classList.add("clickable-card");
      movieDiv.classList.add("mb-5");
      movieDiv.classList.add("mb-md-5");
      movieDiv.classList.add("card-height");
      movieDiv.setAttribute("data-movie-overview", movie.overview); // Set the movie overview as an attribute
      colDiv.appendChild(movieDiv);
      rowDiv.appendChild(colDiv);
      CONTAINER.appendChild(rowDiv);
    }
  });

};


//fetch movie's cast:
const cast = async (movie) => {
  const url = constructUrl(`movie/${movie}/credits`)
  const res = await fetch(url)
  return res.json()
}

//fetch triler videos :
const videos = async (movie) => {
  const url = constructUrl(`movie/${movie}/videos`)
  const res = await fetch(url)
  return res.json();
}

// fetch similar movies : 

const similarMoveies = async (movie) => {
  const url = constructUrl(`movie/${movie}/similar`)
  const res = await fetch(url)
  return res.json()
}


// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, video, similar, cast) => {

  const res = async () => {

  }
  CONTAINER.innerHTML = `
    
        <div class="row justify-content-center mb-3 mb-md-4">
             <img id="movie-backdrop" class= "rounded" src=${BACKDROP_BASE_URL + movie.backdrop_path}>
        </div>
    <div class="row px-4 px-lg-0">    
      <div class="col-12 col-md-6">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
            <p ><b>Genres: </b> ${movie.genres.map(genre => ` ${genre.name} `)}</p>
            <p><b>Rating:</b> ${(movie.vote_average * 10).toFixed(0)}% of ${movie.vote_count} users like this movie</p>
            <p ><b>Languages: </b> ${movie.spoken_languages.map((languge) => `${languge.english_name}`)}</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
            <p><b>Director: </b> ${cast.crew.find(crew => crew.job === 'Director').name} </p>
        </div>
        <div class="col-12 col-md-6">
        <h4> TRILER </h4>
          <iframe width = 100% height = 100% class = "rounded" src="//www.youtube.com/embed/${video.results[0].key}" frameborder="0" allowfullscreen></iframe>
      </div>
        <div class= "flex-colmun px-4 mt-5 px-lg-0">
        <div class= "">
        <h3>Actors:</h3>
        <div id= "actorsInMovei"class = "d-flex related" ></div> 
        </div>
        <div class= " ">
        <h3 class = " mt-md-5">Similar Movies:</h3>
        <div id= "similarMovies" class = "d-flex related"></div> 
        </div>
        <div class= "">
        <h3 class = "my-2 my-lg-4 ">Production Companies:</h3> 
        <div id='companies' class='flex-colmun d-lg-flex mb-2 justify-content-around my-5'></div>
        </div>
        </div> 
    `;
  // const Director = cast.crew.find(crew => crew.job === 'Director').name
  const companies = movie.production_companies
  const companyDiv = document.querySelector('#companies')
  companies.slice(0, 2).forEach(company => {
    if (company.logo_path != null) {
      const copmCard = document.createElement('div')
      copmCard.classList.add('my-2')
      copmCard.classList.add('col-4')
      copmCard.id = "company-card"
      copmCard.innerHTML = `
  <img id="movie-backdrop" class= "rounded" src=${PROFILE_BASE_URL + company.logo_path} > `
      companyDiv.appendChild(copmCard)
    }
  })
  const similarDiv = document.querySelector("#similarMovies")
  const similarMoveies = similar.results.slice(0, 5)
  similarMoveies.forEach(movie => {
    if (movie.poster_path !== null) {
      const movieDiv = document.createElement("div")
      movieDiv.classList.add('col-8')
      movieDiv.classList.add('col-md-6')
      movieDiv.classList.add('col-lg-4')
      movieDiv.classList.add('pt-3')
      movieDiv.id = "similar-movie"
      movieDiv.innerHTML = `
      <img src="${BACKDROP_BASE_URL + movie.poster_path}" alt="${movie.title} poster" class="card-img-top rounded" height="350px">
      <div class="card-body">
        <h3 class="card-title text-center">${movie.title}</h3>
      </div>`
      movieDiv.addEventListener('click', () => {
        movieDetails(movie)
      })
      movieDiv.classList.add("clickable-card");
      similarDiv.appendChild(movieDiv)
    }
  })
  const actorsDiv = document.querySelector('#actorsInMovei')
  const actorsInMovei = cast.cast.slice(0, 5)
  actorsInMovei.forEach(actor => {
    const actorDiv = document.createElement("div")
    actorDiv.classList.add('col-12')
    actorDiv.classList.add('col-md-6')
    actorDiv.classList.add('col-lg-4')
    actorDiv.id = "actor-card"
    if (actor.profile_path !== null) {
      actorDiv.innerHTML = `
      <img src="${PROFILE_BASE_URL + actor.profile_path}" alt="${actor.original_name} poster" class=" rounded" >
      <div class="">
        <h3 class=" text-center py-2">${actor.original_name}</h3>
      </div>`
      actorDiv.addEventListener('click', () => {
        
        actorDetails(actor)
      })
      actorsDiv.appendChild(actorDiv)
    }
  })
};


//search function :
const search = document.querySelector("#search")
search.onkeyup = (e) => {
  searchInput(e.target.value)
}

const  searchInput = async (value) => {
  const url = constructUrl('search/movie') +`&language=en-US&query=${value}&page=1&include_adult=false`
  const resp = await fetch(url)
  const data = await resp.json()
  const idRes = await fetchMovie(data.results.map(result => result.id))
  renderMovies(data.results, idRes)
}


// codes by Izdihar dropdown part; filter and genre
const filterDropdown = document.getElementById('filter');
const filterButton = document.getElementById('filter-btn')

filterButton.addEventListener('click', () => {
  filterDropdown.style.display = 'block';
});

filterDropdown.addEventListener('mouseleave', () => {
  filterDropdown.style.display = 'none';
});

const genreul = document.getElementById('genre');  //genre ul
const genreDropdown = document.getElementById('genre-dropdown') //genre dropdown 

genreDropdown.addEventListener('click', () => {
  genreul.style.display = 'block';
});

genreul.addEventListener('mouseleave', () => {
  genreul.style.display = 'none';
});

//fetching genre here !!!
const genreUl = document.querySelector("#genre")
function getGenere() {
  const url = constructUrl('genre/movie/list')
  fetch(url)
    .then(res => res.json())
    .then(data => createGenreItme(data.genres))
}
function createGenreItme(itme) {
  itme.forEach(el => {
    const genreItme = document.createElement('li')
    genreItme.textContent = el.name
    genreItme.classList.add('genre')
    genreUl.appendChild(genreItme)

    genreItme.addEventListener("click",async () => {
      const url = constructUrl('discover/movie') + `&with_genres=${el.id}`
      const resp = await fetch(url)
      const data = await resp.json()
      const idRes = await fetchMovie(data.results.map(result => result.id))
         renderMovies(data.results,idRes)
    })

  })
}
getGenere()


const filter = document.querySelectorAll('.filter'); // Error: filter is a NodeList, not an array;
filter.forEach(element => { // Error: filter.forEach is not a function
  element.addEventListener('click',async () => {

    if (element.textContent === 'Now playing') {
      const url = constructUrl('movie/now_playing') 
      const resp = await fetch(url)
      const data = await resp.json()
      const idRes = await fetchMovie(data.results.map(result => result.id))
      renderMovies(data.results, idRes)
    }
    else if (element.textContent === 'Up coming') {
      const url = constructUrl('movie/upcoming')
      const resp = await fetch(url)
      const data = await resp.json()
      const idRes = await fetchMovie(data.results.map(result => result.id))
      renderMovies(data.results, idRes)
    }
    else if (element.textContent === 'Popular') {
      const url = constructUrl('movie/popular')
      const resp = await fetch(url)
      const data = await resp.json()
      const idRes = await fetchMovie(data.results.map(result => result.id))
      renderMovies(data.results, idRes)
    }
    else if (element.textContent === 'Top rated') {
      const url = constructUrl('movie/top_rated')
      const resp = await fetch(url)
      const data = await resp.json()
      const idRes = await fetchMovie(data.results.map(result => result.id))
      renderMovies(data.results, idRes)
    }
  })
})


//navbar home: when I click on the home, the main page displays//not working yet ! , it's working now :D

const home = document.querySelector('#home')
home.addEventListener('click', async () => {
  // call the function that fetches movies from an API
  const movies = await fetchMovies();
  const idRes = await fetchMovie(movies.results.map(result => result.id))
  // Call the renderMovies function with the retrieved movies
  renderMovies(movies.results,idRes);
});


//fetching actors & rendering

const fetchActors = async () => {
  const url = constructUrl("trending/person/week")
  const res = await fetch(url)
  return res.json()
}

const actorsPage = document.querySelector('.actors-page')
actorsPage.addEventListener('click', async () => {
  //takes you to the actors page
  const actorsData = await fetchActors()
  // console.log(actorsData.results)
  renderActors(actorsData.results)
})
const renderActors = (actors) => {
  
  CONTAINER.innerHTML = ""
  const row = document.createElement('div')
  row.classList.add("row")
  actors.map(actor => {
  
    if (actor.profile_path !== null){
      const actorDiv = document.createElement("div")
      actorDiv.classList.add('clickable-card')
      actorDiv.classList.add('d-flex')
      actorDiv.classList.add('flex-column')
      actorDiv.classList.add('justify-content-center')
      actorDiv.classList.add('col-12')
      actorDiv.classList.add('col-md-6')
      actorDiv.classList.add('col-lg-3')
      actorDiv.id = "actors-main-page"
      actorDiv.innerHTML = `
    <img src="${PROFILE_BASE_URL + actor.profile_path}" alt="${actor.original_name} poster" class=" rounded" >
      <div class="card-body">
        <h3 class=" text-center">${actor.original_name}</h3>
      </div>
    `
    actorDiv.addEventListener("click", () => {
      actorDetails(actor)
    })
      
      row.appendChild(actorDiv)
      CONTAINER.appendChild(row)
    }
  })
}

//fetching actor Details & renrdering
//fetch
const fetchactor = async (actor) => {
const url = constructUrl(`person/${actor}`)
const res = await fetch(url)
return res.json()
}
// target an actor
const actorDetails = async (actor) => {
const actorRes = await fetchactor(actor.id)
renderActor(actorRes)
}
//render in container

const renderActor = (actor) => {
  CONTAINER.innerHTML = ""
  const actorDiv = document.createElement("div")
  actorDiv.classList.add("actor-div")
  actorDiv.innerHTML = `
  <div class = "actor-info">

  <div class = "actor-text" >
  <h1>${actor.name}</h1>
  <p>Gender : ${actor.gender === 1 ? 'Female':'Male'}</p>
  <p>Popularity : ${actor.popularity}</p>
  <p>Birthday : ${actor.birthday}</p>
  <p id = "biography"> Biography: ${actor.biography}</p>
  </div>

  <div class = "actor-img">
  <img src="${PROFILE_BASE_URL + actor.profile_path}" alt="${actor.original_name} poster" class="photo" >
  </div>

  </div>

  <div id = "related" class = " d-flex related">
  
  </div>
  `
  const biography = actorDiv.querySelector("#biography")  
  if (actor.deathday !== null) {
    const deathDay = document.createElement('p')
    deathDay.textContent = `Deathday : ${actor.deathday}`
    biography.parentNode.insertBefore(deathDay,biography)
  }
  CONTAINER.appendChild(actorDiv)
  moviesRelatedToActore(actor.id)

}

const moviesRelatedToActore = async (actor) => {
  const relatedMovies = document.querySelector('#related')
  const url = constructUrl(`person/${actor}/movie_credits`)
  const res = await fetch(url)
  const data = await res.json() 
  data.cast.slice(0, 6).forEach(movie => {
    if (movie.poster_path !== null){
      const movieDiv = document.createElement("div")
      movieDiv.classList.add("col-12")
      movieDiv.classList.add("col-md-6")
      movieDiv.classList.add("col-lg-4")
      movieDiv.classList.add("pt-3")
      movieDiv.classList.add("card-click")
      movieDiv.innerHTML = `
  <img src="${BACKDROP_BASE_URL + movie.poster_path}" alt="${movie.title} poster" class="card-img-top rounded" height="350px">
      <div class="card-body">
        <h3 class="card-title text-center">${movie.title}</h3>
      </div>
  `
      relatedMovies.addEventListener("click", () => {
        movieDetails(movie)
      })
      relatedMovies.appendChild(movieDiv)
    }
   
  })
}



//about page
const aboutPage = document.querySelector('.about-page')
aboutPage.addEventListener('click', () => {
  CONTAINER.innerHTML = ""
  const about = document.createElement('div')
  about.classList.add('about')
  about.innerHTML= `
  <h1 class = 'text-center'>&ldquo; THERE IS NO PIRARCY HERE, JUST HANGING AROUND MOVIES &rdquo;</h1>
  <div class = 'gif'>
  <img src="./images/beetlejuice-just-hanging-around.gif" alt="" class = 'rounded'>
  </div>
  `
  CONTAINER.appendChild(about)
})

//this code make the name display block you hover on the image of the footer
const images = document.querySelectorAll('.image-container img');

images.forEach((image) => {
  image.addEventListener('mouseover', function() {
    const span = this.nextElementSibling;
    span.style.display = 'block'
  });
  image.addEventListener('mouseleave', function() {
    const span = this.nextElementSibling;
    span.style.display = 'none'
  });
});

document.addEventListener("DOMContentLoaded", autorun);


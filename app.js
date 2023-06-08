//const
const apikey = "675e1c28e8f3235c7e68d1a825036bd5";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const youtubeKey = "AIzaSyDGbbtsKoHRKegMM-kgVXhiFz-H-IlW7eU";

const apiPath = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMovieList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youtubeKey}`,

}

//Boots up the app
function init() {
    fetchTrendingMovies()
    fetchAndBuildAllSecton()
}

function fetchTrendingMovies() {
    fetchAndBuildmovieSecton(apiPath.fetchTrending, 'Trending Now')

        .then(list => {
            const randomIndex = parseInt(Math.random() * list.length);
            buildBannerSection(list[randomIndex]);
        }).catch(err => {
            console.error(err)
        });
}

function buildBannerSection(movie) {
    const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;
    const div = document.createElement('div');
    div.className = "banner-content"
    div.innerHTML = `
    <h2 class="banner_title">${movie.title}</h2>
    <p class="banner_info">${movie.release_date}</p>
    <p class="banner_overview">${movie.overview}</p>
    <div class="action-buttons-con">
        <button class="action-button"><i class="fa-solid fa-play"></i>Play</button>
        <button class="action-button"><i class="fa-solid fa-circle-info"></i>More Info</button>
    </div>
    `
    bannerCont.append(div);

}



function fetchAndBuildAllSecton() {
    fetch(apiPath.fetchAllCategories)
        .then(response => response.json())
        .then(response => {
            const categories = response.genres;
            if (Array.isArray(categories) && categories.length) {
                categories.forEach(category => {
                    fetchAndBuildmovieSecton(apiPath.fetchMovieList(category.id), category.name)
                })
            }
        })
        .catch(err => console.log(err));
}



function fetchAndBuildmovieSecton(fetchUrl, category) {
    return fetch(fetchUrl)
        .then(response => response.json())
        .then(response => {

            const movies = response.results;
            if (Array.isArray(movies) && movies.length) {
                BuildmovieSecton(movies, category)
            }
            return movies;

        })
        .catch(err => console.log(err));
}


function BuildmovieSecton(list, categoryName) {
    const moviesCon = document.getElementById("movies-con");
    const moviesListHtml = list.map(item => {
        return `
        
        <div  id="yt${item.id}" >
        <img class="movie-item"  src="${imgPath}${item.backdrop_path}" alt="${item.title}" onmouseover="searchMovieTrailer('${item.title}', 'yt${item.id}')">
        
        </div>
            `;
    }).join("");
    
   
    const moviesSectionHtml = `     
            <h2 class="movies-section-heading">${categoryName} <span class="explore">explore all</span> </h2>
            <div class="movies-row">
                ${moviesListHtml}
            </div>
            `
    const div = document.createElement('div');
    div.className = "movies-section"
    div.innerHTML = moviesSectionHtml;
    moviesCon.append(div);
}

//movie trailer
function searchMovieTrailer(movieName,ifremId) {
    if (movieName=='undefined'){
        console.log('Trailer NOt Found');
        return;
    } 

    if(movieName){
    fetch(apiPath.searchOnYoutube(movieName))
        .then(response => response.json())
        .then(response => {
            
            const bestResult = response.items[0];
            const youttubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;  
            console.log(youttubeUrl)
            const elements = document.getElementById(ifremId);
            const div = document.createElement('div');
            elements.innerHTML = `<iframe style=" border:none; outline:none " width="350px" height="200px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1" >
            </iframe>`
            elements.style.transform = 'translateY(-0%) scale(1.1)';
            elements.append(div)
        })
        .catch(err => console.log(err))
}
}


window.addEventListener('load', function () {
    init();
    window.addEventListener('scroll', function () {
        const header = document.getElementById('header')
        if (window.scrollY > 5) {
            header.classList.add('black-bg')
        }
        else {
            header.classList.remove('black-bg')

        }
    })
})
const myStorage= window.localStorage;
const watchlist = myStorage.getItem('watchlist') ? JSON.parse(localStorage.getItem('watchlist')) : {};
let oldhtml;

document.addEventListener(`DOMContentLoaded`, () => {     
    document.getElementById('search-form').addEventListener('submit', e => {
        e.preventDefault()
        document.getElementById('movieContainer').innerHTML = renderMovies(movieData);
    })
    
    oldhtml = document.getElementById('movieContainer').innerHTML;
});




function renderMovies (movieArray) {
    movieHTML= movieArray.map(currentMovie => {
        return `<div class="movie rounded">
        <img src="${currentMovie.Poster}" onClick="movieInfo(${currentMovie.imdbID}, this)" alt="${currentMovie.Title} poster" class="movieImage" id="${currentMovie.imdbID}poster">
        <div class="rounded movieInfo" id="${currentMovie.imdbID}">
        <h5 class="movieTitle">${currentMovie.Title}</h5>
        <p class="movieYear">${currentMovie.Year}</p>
        <div class="addButton">
        <button onClick="addFav('${currentMovie.imdbID}')" class="btn">+</button>
        <button onClick="removeFav('${currentMovie.imdbID}')" class="btn">-</button>
        </div>
        </div>
        </div>`
    })
    return movieHTML.join('')
}


function addFav (id) {
    if(!watchlist[id]){
        let currentMovie = movieData.find(movie => {
            return movie.imdbID === id;
        })
        watchlist[id] = currentMovie;
        myStorage.setItem('watchlist', JSON.stringify(watchlist));
    }else {
        return
    }
}
function removeFav (id) {
    if(watchlist[id]){
        delete watchlist[id];
        myStorage.setItem('watchlist', JSON.stringify(watchlist));
    }else {
        return
    }
}



function movieInfo (movieID, element) {
    element.style.height === "100%" ? element.style.height = '50%' : element.style.height = '100%'
     movieID.style.opacity == 0 ? movieID.style.opacity = 1 : movieID.style.opacity = 0;
     movieID.style.transition = "opacity 1s";
     element.style.transition = "height 1s"
    }
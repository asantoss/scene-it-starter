const myStorage= window.localStorage;
const watchlist = myStorage.getItem('watchlist') ? JSON.parse(localStorage.getItem('watchlist')) : {};
let oldhtml;
let movieHTML;

document.addEventListener(`DOMContentLoaded`, () => {     
        document.getElementById('movieContainer').innerHTML = renderMovies(movieData);
    
    oldhtml = document.getElementById('movieContainer').innerHTML;

    document.getElementById('searchText').addEventListener('input', function searchMovie (e) {
        let text = e.target.value.toLowerCase()
        var search = movieData.filter(e =>{
            let findInTitle = e.Title.toLowerCase().indexOf(text) > -1
            let findInYear = e.Year.toLowerCase().indexOf(text) > -1
            return findInTitle || findInYear;
        })
        return document.getElementById('movieContainer').innerHTML = renderMovies(search);
     });
});

function renderMovies (movieArray) {
    movieHTML= movieArray.map(currentMovie => {
        return `<div class="movie rounded">
        <img src="${currentMovie.Poster}" onClick="movieInfo(${currentMovie.imdbID}, this)" alt="${currentMovie.Title} poster" class="movieImage">
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
    movieID.style.opacity == 0 ? movieID.style.opacity = 1 : movieID.style.opacity = 0;
    movieID.style.transition = "opacity 1s";
    element.style.width === '50%' ? element.style.width = "100%" : element.style.width = "50%"
    element.style.transition = "width 1s";
    }
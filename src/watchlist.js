let favoriteMovies= []
let container;
document.addEventListener('DOMContentLoaded', () => {
    container = document.getElementById('movieContainer')

    favoriteMovies = JSON.parse(localStorage.getItem('watchlist'));
    container.innerHTML = renderMovies(favoriteMovies)
})

function renderMovies (movieArray) {
    let movieHTML= movieArray.map(currentMovie => {
        return `<div class="movie rounded">
        <img src="${currentMovie.Poster}" onClick="movieInfo(${currentMovie.imdbID}, this)" alt="${currentMovie.Title} poster" class="movieImage">
        <div class="rounded movieInfo" id="${currentMovie.imdbID}">
        <h5 class="movieTitle">${currentMovie.Title}</h5>
        <p class="movieYear">${currentMovie.Year}</p>
        <div class="addButton">
        <button onClick="removeFav('${currentMovie.imdbID}')" class="btn">Remove</button>
        </div>
        </div>
        </div>`
    })
    return movieHTML.join('')
}
function removeFav (id) {
    favoriteMovies.forEach(e => {
        if(e.imdbID === id){
            let index = favoriteMovies.indexOf(e)
            favoriteMovies.splice(index, 1)
        }
    })
    localStorage.setItem('watchlist', JSON.stringify(favoriteMovies))

    return container.innerHTML = renderMovies(favoriteMovies)
}
function movieInfo (movieID, element) {
    movieID.style.opacity == 0 ? movieID.style.opacity = 1 : movieID.style.opacity = 0;
    movieID.style.transition = "opacity 1s";
    element.style.width === '50%' ? element.style.width = "100%" : element.style.width = "50%"
    element.style.transition = "width 1s";
    }
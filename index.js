document.addEventListener(`DOMContentLoaded`, function() {     
    function renderMovies (movieArray) {
        movieHTML= movieArray.map(currentMovie => {
            return `<div class="movie rounded">
            <img src="${currentMovie.Poster}" onClick="movieInfo(${currentMovie.imdbID})" alt="${currentMovie.Title} poster" class="movieImage">
            <div class="rounded movieInfo" id="${currentMovie.imdbID}">
            <h5 class="movieTitle">${currentMovie.Title}</h5>
            <br>
            <br>
            <p class=" ">Released: ${currentMovie.Year}</p>
            <br>
            <div class="addButton">
            <button class="btn">+</button>
            </div>
            </div>
            </div>`
        })
        return movieHTML.join('')
    }
 document.getElementById('movieContainer').innerHTML = renderMovies(movieData);
 });


 function movieInfo (movieID) {
    movieID.style.opacity == 0 ? movieID.style.opacity = 1 : movieID.style.opacity = 0;
    movieID.style.transition = "opacity 1s"
 }
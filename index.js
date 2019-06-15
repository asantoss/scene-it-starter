let myStorage= localStorage.getItem('watchlist');
let container;
let  buttonHTML;
let watchlist = myStorage === null ? [] : JSON.parse(myStorage);


document.addEventListener(`DOMContentLoaded`, () => {   
    container = document.getElementById('movieContainer')  
    container.innerHTML = renderMovies(movieData);
    document.getElementById('searchText').addEventListener('input', function searchMovie (e) {
        let text = e.target.value.toLowerCase()
        var search = movieData.filter(e =>{
            let findInTitle = e.Title.toLowerCase().indexOf(text) > -1
            let findInYear = e.Year.toLowerCase().indexOf(text) > -1
            return findInTitle || findInYear;
        })
        return container = renderMovies(search);
     });
});

function renderMovies (movieArray) {
    movieHTML= movieArray.map(currentMovie => {
        buttonHTML = `<div class="addButton">
        <button onClick="addFav('${currentMovie.imdbID}')" class="btn" id="${currentMovie.imdbID}button">Add</button>
        </div>` 
        for(let i = 0; i < watchlist.length; i++){
            let element = watchlist[i];
            if(element.imdbID === currentMovie.imdbID){
                buttonHTML = `<div class="addButton">
                <button onClick="removeFav('${currentMovie.imdbID}')" class="btn">Remove</button>
                </div>`
            }
        }

        return `<div class="movie rounded">
        <img src="${currentMovie.Poster}" onClick="movieInfo(${currentMovie.imdbID}, this)" alt="${currentMovie.Title} poster" class="movieImage">
        <div class="rounded movieInfo" id="${currentMovie.imdbID}">
        <h5 class="movieTitle">${currentMovie.Title}</h5>
        <p class="movieYear">${currentMovie.Year}</p>
        ${buttonHTML}
        </div>
        </div>`
    })
    return movieHTML.join('')
}


function saveLocalStorage(key, value) {

    value = JSON.stringify(value);
    return localStorage.setItem(key, value) 
}


function addFav (id) {
    let currentMovie = movieData.find(movie => {
        return movie.imdbID === id;
    })
    for(let i=0; i < watchlist.length; i++){
        let element = watchlist[i]
        if(element.imdbID === id){
            return
        }
    }
        watchlist.push(currentMovie)
        saveLocalStorage('watchlist', watchlist);
        return container.innerHTML = renderMovies(movieData)
}
function removeFav (id) {
    watchlist.forEach(e => {
        if(e.imdbID === id){
            let index = watchlist.indexOf(e)
            watchlist.splice(index, 1)
        }
    })
    saveLocalStorage('watchlist', watchlist);

    return container.innerHTML = renderMovies(movieData)
}



function movieInfo (movieID, element) {
    movieID.style.opacity == 0 ? movieID.style.opacity = 1 : movieID.style.opacity = 0;
    movieID.style.transition = "opacity 1s";
    element.style.width === '50%' ? element.style.width = "100%" : element.style.width = "50%"
    element.style.transition = "width 1s";
    }
let favoriteMovies = []
let container;
let dropdown;
document.addEventListener('DOMContentLoaded', () => {
    container = document.getElementById('movieContainer')
    favoriteMovies = JSON.parse(localStorage.getItem('watchlist'));
    dropdown = document.getElementById('sorter');
    dropdown.addEventListener('change', () => {
        sort(dropdown.value)
        container.innerHTML = renderMovies(favoriteMovies)
    })
    sort(dropdown.value)
    container.innerHTML = renderMovies(favoriteMovies)

})

function sort(value) {
    if (value === "newest") {
        return favoriteMovies.sort((a, b) => { return b.Year - a.Year })
    } else if (value === "oldest") {
        return favoriteMovies.sort((a, b) => { return a.Year - b.Year })
    } else if (value === "name") {
        favoriteMovies.sort((a, b) => {
            if (a.Title < b.Title) {
                return -1
            };
        })
    } else if (value === "nameDes") {
        favoriteMovies.sort((a, b) => {
            if (a.Title > b.Title) {
                return -1
            };
        })
    }
}

function renderMovies(movieArray) {
    let movieHTML = movieArray.map(currentMovie => {
        return `<div class="movie rounded">
        <div>
        <img src="${currentMovie.Poster}" onClick="movieInfo(${currentMovie.imdbID}, this)" alt="${currentMovie.Title} poster" class="movieImage">
        </div>
        <div class="rounded movieInfo" id="${currentMovie.imdbID}">
        <h5 class="movieTitle">${currentMovie.Title}</h5>
        <h6 class="movieTitle">${currentMovie.Year}</h6>
        <div class="text-center moreInfo" id="${currentMovie.imdbID}/G">
        <button class="btn-outline-secondary" onClick="moreInfo('${currentMovie.Title}','${currentMovie.imdbID}/G')" >Information</button>
        </div>
        </div>
        <div class="addButton">
        <button onClick="removeFav('${currentMovie.imdbID}')" class="btn btn-danger">Remove</button>
        </div>
        </div>`
    })
    return movieHTML.join('')
}

function removeFav(id) {
    favoriteMovies.forEach(e => {
        if (e.imdbID === id) {
            let index = favoriteMovies.indexOf(e)
            favoriteMovies.splice(index, 1)
        }
    })
    localStorage.setItem('watchlist', JSON.stringify(favoriteMovies))

    return container.innerHTML = renderMovies(favoriteMovies)
}

function movieInfo(movieID, element) {
    movieID.style.opacity == 0 ? movieID.style.opacity = 1 : movieID.style.opacity = 0;
    movieID.style.transition = "opacity 1s";
    // element.style.width === '50%' ? element.style.width = "100%" : element.style.width = "50%"
    // element.style.transition = "width 1s";
}
function moreInfo(title, element) {
    let movieHTML = []
    let targetDiv = document.getElementById(`${element}`)
    axios.get(`http://www.omdbapi.com/?apikey=3430a78&t=${encodeURIComponent(title)}&plot=full`)
        .then(result => {
            releasedDate = result.data.Released;
            genre = result.data.Genre;
            movieHTML.push(`<p>${releasedDate}</p>`)
            movieHTML.push(`<p>${genre}</p>`)
            ratings = result.data.Ratings.map(e => {
                return movieHTML.push(`<p>${e.Source}: ${e.Value}</p>`)
            });
        })
        .then(() => {
            targetDiv.innerHTML = movieHTML.join('')
        })

}
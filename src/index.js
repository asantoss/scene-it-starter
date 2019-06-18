let myStorage = localStorage.getItem('watchlist');
let container;
let dropdown;
let buttonHTML;
let movieData;
let moviePages;
let encondedSearchString;
let watchlist = myStorage === null ? [] : JSON.parse(myStorage);


document.addEventListener(`DOMContentLoaded`, () => {
    container = document.getElementById('movieContainer')
    dropdown = document.getElementById('sorter');
    dropdown.addEventListener('change', () => {
        sort(dropdown.value, movieData)
        container.innerHTML = renderMovies(movieData)
    })
    let searchForm = document.getElementById('search-form')
    searchForm.addEventListener('submit', function searchMovie(e) {
        e.preventDefault();
        let pages = document.getElementById('pages');
        pages.innerHTML = ''
        let searchText = document.getElementById('searchText').value.toLowerCase();
        encondedSearchString = encodeURIComponent(searchText);
        axios.get(`http://www.omdbapi.com/?apikey=3430a78&s=${encondedSearchString}`)
            .then(result => {
                moviePages = Math.ceil(result.data.totalResults / 10);
                for (let i = 1; i < 4; i++) {
                    let page = document.createElement('button');
                    page.setAttribute('onClick', `fetchPage(${i}, this)`);
                    page.setAttribute('id', `${i}page`);
                    page.classList.add('text-center')
                    if (i == 1) { page.classList.add('active') }
                    page.innerHTML = i;
                    pages.appendChild(page)
                }
                return movieData = result.data.Search
            })
            .then(() => {
                if (movieData === undefined) {
                    return container.innerHTML = `<h2 style="color: #fefefe;">No movie found!</h2>`
                } else {
                    return container.innerHTML = renderMovies(movieData)
                }
            });
        return
    });
});

function renderMovies(movieArray) {
    movieHTML = movieArray.map(currentMovie => {
        let poster = currentMovie.Poster;
        if (currentMovie.Poster == "N/A") {
            poster = "./assets/no_image.png"
        }
        buttonHTML = `<div class="addButton">
        <button onClick="addFav('${currentMovie.imdbID}')" class="btn btn-success" id="${currentMovie.imdbID}button">Add</button>
        </div>`
        for (let i = 0; i < watchlist.length; i++) {
            let element = watchlist[i];
            if (element.imdbID === currentMovie.imdbID) {
                buttonHTML = `<div class="addButton">
                <button onClick="removeFav('${currentMovie.imdbID}')" class="btn btn-danger">Remove</button>
                </div>`
            }
        }
        // <p class="movieYear">Released: ${rating.join('')}</p>
        // <p class="movieYear">Released: ${genre}</p>
        // <p class="movieYear">Released: ${releasedDate}</p>
        return `<div class="movie rounded">
        <img src="${poster}" onClick="movieInfo(${currentMovie.imdbID},'${currentMovie.Title}')" alt="${currentMovie.Title} poster" class="movieImage">
        <div class="rounded movieInfo" id="${currentMovie.imdbID}">
        <h5 class="movieTitle">${currentMovie.Title}</h5>

        </div>
        ${buttonHTML}
        </div>`
    })
    return movieHTML.join('')
}

function fetchPage(number, element) {
    axios.get(`http://www.omdbapi.com/?apikey=3430a78&s=${encondedSearchString}&page=${number}`)
        .then(result => {
            return movieData = result.data.Search
        })
        .then(() => {
            if (movieData === undefined) {
                return container.innerHTML = `<h2 style="color: #fefefe;">No movie found!</h2>`
            } else {
                return container.innerHTML = renderMovies(movieData)
            }
        });
}

function sort(value, sortArray) {
    if (value === "newest") {
        return sortArray.sort((a, b) => {
            return b.Year - a.Year
        })
    } else if (value === "oldest") {
        return sortArray.sort((a, b) => {
            return a.Year - b.Year
        })
    } else if (value === "name") {
        sortArray.sort((a, b) => {
            if (a.Title < b.Title) {
                return -1
            };
        })
    } else if (value === "nameDes") {
        sortArray.sort((a, b) => {
            if (a.Title > b.Title) {
                return -1
            };
        })
    }
}


function saveLocalStorage(key, value) {

    value = JSON.stringify(value);
    return localStorage.setItem(key, value)
}


function addFav(id) {
    let currentMovie = movieData.find(movie => {
        return movie.imdbID === id;
    })
    for (let i = 0; i < watchlist.length; i++) {
        let element = watchlist[i]
        if (element.imdbID === id) {
            return
        }
    }
    watchlist.push(currentMovie)
    saveLocalStorage('watchlist', watchlist);
    return container.innerHTML = renderMovies(movieData)
}

function removeFav(id) {
    watchlist.forEach(e => {
        if (e.imdbID === id) {
            let index = watchlist.indexOf(e)
            watchlist.splice(index, 1)
        }
    })
    saveLocalStorage('watchlist', watchlist);

    return container.innerHTML = renderMovies(movieData)
}



function movieInfo(movieID, title) {
    let movieInfoHTML = []
    axios.get(`http://www.omdbapi.com/?apikey=3430a78&t=${encodeURIComponent(title)}&plot=full`)
        .then(result => {
            ratings = result.data.Ratings.map(e => {
                movieInfoHTML.push(`<p>${e.Source}: ${e.Value}</p>`);
            });
            releasedDate = result.data.Released;
            genre = result.data.Genre;
        })
        .then(() => {
            movieID.style.opacity == 0 ? movieID.style.opacity = 1 : movieID.style.opacity = 0;
            movieID.style.transition = "opacity 1s";
            movieID.innerHTML = `<h5 class="movieTitle">${title}</h5> 
                                <p>Released: ${releasedDate}</p>
                                <p>${genre}
                                ${movieInfoHTML.join('')}
                                </p>`
        })

    return
}
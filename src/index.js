let myStorage = localStorage.getItem("watchlist");
let container;
let dropdown;
let buttonHTML;
let movieData;
let moviePages;
const renderedPages = 5;
let encondedSearchString;
let watchlist = myStorage === null ? [] : JSON.parse(myStorage);

document.addEventListener(`DOMContentLoaded`, () => {
    container = document.getElementById("movieContainer");
    dropdown = document.getElementById("sorter");
    dropdown.addEventListener("change", () => {
        sort(dropdown.value, movieData);
        container.innerHTML = renderMovies(movieData);
    });
    let searchForm = document.getElementById("search-form");
    searchForm.addEventListener("submit", function searchMovie(e) {
        e.preventDefault();
        let searchText = document.getElementById("searchText").value.toLowerCase();
        encondedSearchString = encodeURIComponent(searchText);
        axios
            .get(`https://api.themoviedb.org/3/search/movie?api_key=231ff08007c871881760666607644536&query=${encondedSearchString}`)
            .then(response => {
                document.getElementById(
                    "pages"
                ).innerHTML = `<button onClick="fetchPage(2)">></button>`;
                moviePages = response.data.total_pages;
                return movieData = response.data.results;
            })
            .then(movieData => {
                if (movieData === undefined) {
                    return container.innerHTML = `<h2 style="color: #fefefe;">No movies found!</h2>`;
                } else {
                    return container.innerHTML = renderMovies(movieData);
                }
            });
    });
});

function renderMovies(movieArray) {
    imageURL = 'https://image.tmdb.org/t/p/w200'
    movieHTML = movieArray.map(currentMovie => {
        let poster = currentMovie.poster_path;
        if (poster == "N/A") {
            poster = "./assets/no_image.png";
        }
        buttonHTML = `<div class="addButton" id="${currentMovie.id}Buttons">
        <button onClick="addFav('${currentMovie.title}', '${
      currentMovie.id
    }Buttons')" class="btn btn-success" id="${
      currentMovie.id
    }button">Add</button>
        </div>`;
        for (let i = 0; i < watchlist.length; i++) {
            let element = watchlist[i];
            if (element.title === currentMovie.title) {
                buttonHTML = `<div class="addButton" id="${currentMovie.title}Buttons">
                <button onClick="removeFav('${currentMovie.title}', '${
          currentMovie.id
        }Buttons')" class="btn btn-danger">Remove</button>
                </div>`;
            }
        }
        return `<div class="movie rounded mx-2">
        <img src="${imageURL}${poster}" onClick="movieInfo('${
      currentMovie.id
    }Info', this)" alt="${currentMovie.title} poster" class="movieImage">
        <div class="rounded movieInfo" id="${currentMovie.id}Info">
        <h5 class="movieTitle">${currentMovie.title}</h5>
        <h6 class="movieTitle">${currentMovie.release_date}</h6>
        <div class="text-center moreInfo" id="${currentMovie.id}/G">
        <button class="btn-outline-secondary" onClick="moreInfo('${currentMovie.id}','${currentMovie.id}/G')" >Movie Details</button>
        </div>
        </div>
        ${buttonHTML}
        </div>`;
    });
    return movieHTML.join("");
}

function checkPoster(posterURL) {}

function fetchPage(number) {
    number = Number.parseInt(number);
    axios
        .get(
            `https://www.omdbapi.com/?apikey=3430a78&s=${encondedSearchString}&page=${number}`
        )
        .then(result => {
            return (movieData = result.data.Search);
        })
        .then(movieData => {
            if (movieData === undefined) {
                return (container.innerHTML = `<h2 style="color: #fefefe;">No movies found!</h2>`);
            } else {
                return (container.innerHTML = renderMovies(movieData));
            }
        })
        .then(() => {
            let tarGet = document.getElementById("pages");
            if (number === 1) {
                pagesHTML = [
                    `<button onClick="fetchPage('${number +
            1}')" class="button">></button>`
                ];
                return (tarGet.innerHTML = pagesHTML.join(""));
            }
            return (document.getElementById("pages").innerHTML = [
                `<button onClick="fetchPage('${number -
          1}')" class="button"><</button>`,
                `<button onClick="fetchPage('${number + 1}')" class="button">></button>`
            ].join(""));
        });
}

function sort(value, sortArray) {
    if (value === "newest") {
        sortArray.sort((a, b) => {
            return b.Year - a.Year;
        });
    } else if (value === "oldest") {
        sortArray.sort((a, b) => {
            return a.Year - b.Year;
        });
    } else if (value === "name") {
        sortArray.sort((a, b) => {
            if (a.Title < b.Title) {
                return -1;
            }
        });
    } else if (value === "nameDes") {
        sortArray.sort((a, b) => {
            if (a.Title > b.Title) {
                return -1;
            }
        });
    }
}

function saveLocalStorage(key, value) {
    value = JSON.stringify(value);
    return localStorage.setItem(key, value);
}

function addFav(title, element) {
    let buttonHTML = document.getElementById(element);
    console.log(movieData)
    id = element.split('B')[0];
    debugger;
    let currentMovie = movieData.find(movie => {
        return movie.title === title;
    });
    for (let i = 0; i < watchlist.length; i++) {
        let element = watchlist[i];
        console.log(element.id)
        if (element.title === title) {
            return;
        }
    }
    watchlist.push(currentMovie);
    saveLocalStorage("watchlist", watchlist);

    return (buttonHTML.innerHTML = `<button onclick="removeFav('${title}','${id}Buttons')" class="btn btn-danger" id="tt1345836button">Remove</button>`);
}

function removeFav(id, element) {
    let buttonHTML = document.getElementById(element);
    watchlist.forEach(e => {
        if (e.imdbID === id || e.Title === id) {
            let index = watchlist.indexOf(e);
            watchlist.splice(index, 1);
        }
    });
    saveLocalStorage("watchlist", watchlist);
    return (buttonHTML.innerHTML = `<button onclick="addFav('${id}','${id}Buttons')" class="btn btn-success" id="tt1345836button">Add</button>`);
}

function movieInfo(movieID) {
    element = document.getElementById(`${movieID}`);
    element.style.opacity == 0 ?
        (element.style.opacity = 1) :
        (element.style.opacity = 0);
    element.style.transition = "opacity 1s";
}

function moreInfo(id, element) {
    let targetDiv = document.getElementById(`${element}`);
    axios
        .get(`https://api.themoviedb.org/3/movie/${encodeURIComponent(id)}?api_key=231ff08007c871881760666607644536&language=en-US`)
        .then(result => {
            genre = `${result.data.genres[0].name} & ${result.data.genres[1].name}`;
            movieHTML = []
            movieHTML.push(`<p>${genre}</p>`);
            id = result.data.imdb_id;
            return movieHTML;
        })
        .then(movieHTML => {
            axios.get(`https://www.omdbapi.com/?apikey=3430a78&i=${encodeURIComponent(id)}&plot=full`)
                .then(result => {
                    ratings = result.data.Ratings.map(e => {
                        return movieHTML.push(`<p>${e.Source}: ${e.Value}</p>`);
                    })
                });
            setTimeout(() => { targetDiv.innerHTML = movieHTML.join('') }, 2000)
        })
        // .then(() => {
        //   movieHTML.push(
        //     `<button class="btn-outline-secondary" onClick="recommend('${title}')">Recommendations</button>`
        //   );
        // });
        // targetDiv.innerHTML = movieHTML.join("");
}

function lessInfo(element) {
    movieHTML = document.getElementById(`${element}`);
    return (movieHTML.innerHTML =
        '<button class="btn movieTitle" onclick="moreInfo()">More info</button>');
}

function recommend(title) {
    title = encodeURIComponent(title);
    axios
        .get(
            `https://api.themoviedb.org/3/search/movie?api_key=231ff08007c871881760666607644536&query=${title}`
        )
        .then(res => {
            return res.data.results[0].id;
        })
        .then(tmdbId => {
            axios
                .get(
                    `https://api.themoviedb.org/3/movie/${tmdbId}/recommendations?api_key=231ff08007c871881760666607644536&language=en-US&page=1`
                )
                .then(res => {
                    const recommendations = res.data.results.map(movie => {
                        return movie.original_title;
                    });
                    return recommendations;
                })
                .then(recommendations => {
                    return Promise.all(
                        recommendations.map(movie => {
                            return axios.get(
                                `https://www.omdbapi.com/?apikey=3430a78&t=${encodeURIComponent(
                  movie
                )}`
                            );
                        })
                    );
                })
                .then(recommendedMovies => {
                    console.log(recommendedMovies);
                    recommendedMovies = recommendedMovies.map(e => {
                        return e.data;
                    });
                    document.getElementById("movieContainer").innerHTML = renderMovies(
                        recommendedMovies
                    );
                });
        });
}
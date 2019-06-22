let myStorage = localStorage.getItem("watchlist");
let container;
let dropdown;
let buttonHTML;
let movieData;
let moviePages;
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
    let pages = document.getElementById("pages");
    pages.innerHTML = "";
    let searchText = document.getElementById("searchText").value.toLowerCase();
    encondedSearchString = encodeURIComponent(searchText);
    axios
      .get(`https://www.omdbapi.com/?apikey=3430a78&s=${encondedSearchString}`)
      .then(result => {
        moviePages = Math.ceil(result.data.totalResults / 10);
        for (let i = 1; i < 5; i++) {
          let page = document.createElement("button");
          page.setAttribute("onClick", `fetchPage(${i}, this)`);
          page.setAttribute("id", `${i}page`);
          page.classList.add("text-center");
          if (i == 1) {
            page.classList.add("active");
          }
          page.innerHTML = i;
          pages.appendChild(page);
        }
        return (movieData = result.data.Search);
      })
      .then(() => {
        if (movieData === undefined) {
          return (container.innerHTML = `<h2 style="color: #fefefe;">No movies found!</h2>`);
        } else {
          return (container.innerHTML = renderMovies(movieData));
        }
      });
    return;
  });
});

function renderMovies(movieArray) {
  movieHTML = movieArray.map(currentMovie => {
    let poster = currentMovie.Poster;
    if (currentMovie.Poster == "N/A") {
      poster = "./assets/no_image.png";
    }
    buttonHTML = `<div class="addButton" id="${currentMovie.imdbID}Buttons">
        <button onClick="addFav('${currentMovie.imdbID}', '${
      currentMovie.imdbID
    }Buttons')" class="btn btn-success" id="${
      currentMovie.imdbID
    }button">Add</button>
        </div>`;
    for (let i = 0; i < watchlist.length; i++) {
      let element = watchlist[i];
      if (element.imdbID === currentMovie.imdbID) {
        buttonHTML = `<div class="addButton" id="${currentMovie.imdbID}Buttons">
                <button onClick="removeFav('${currentMovie.imdbID}', '${
          currentMovie.imdbID
        }Buttons')" class="btn btn-danger">Remove</button>
                </div>`;
      }
    }
    return `<div class="movie rounded mx-2">
        <img src="${poster}" onClick="movieInfo('${
      currentMovie.imdbID
    }Info', this)" alt="${currentMovie.Title} poster" class="movieImage">
        <div class="rounded movieInfo" id="${currentMovie.imdbID}Info">
        <h5 class="movieTitle">${currentMovie.Title}</h5>
        <h6 class="movieTitle">${currentMovie.Year}</h6>
        <div class="text-center moreInfo" id="${currentMovie.imdbID}/G">
        <button class="btn-outline-secondary" onClick="moreInfo('${
          currentMovie.Title
        }','${currentMovie.imdbID}/G')" >Movie Details</button>
        </div>
        </div>
        ${buttonHTML}
        </div>`;
  });
  return movieHTML.join("");
}

function fetchPage(number, element) {
  axios
    .get(
      `https://www.omdbapi.com/?apikey=3430a78&s=${encondedSearchString}&page=${number}`
    )
    .then(result => {
      return (movieData = result.data.Search);
    })
    .then(() => {
      if (movieData === undefined) {
        return (container.innerHTML = `<h2 style="color: #fefefe;">No movie found!</h2>`);
      } else {
        return (container.innerHTML = renderMovies(movieData));
      }
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

function addFav(id, element) {
  let buttonHTML = document.getElementById(element);
  let currentMovie = movieData.find(movie => {
    return movie.imdbID === id;
  });
  for (let i = 0; i < watchlist.length; i++) {
    let element = watchlist[i];
    if (element.imdbID === id) {
      return;
    }
  }
  watchlist.push(currentMovie);
  saveLocalStorage("watchlist", watchlist);

  return (buttonHTML.innerHTML = `<button onclick="removeFav('${id}','${id}Buttons')" class="btn btn-danger" id="tt1345836button">Remove</button>`);
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
  element.style.opacity == 0
    ? (element.style.opacity = 1)
    : (element.style.opacity = 0);
  element.style.transition = "opacity 1s";
}

function moreInfo(title, element) {
  let movieHTML = [];
  let targetDiv = document.getElementById(`${element}`);
  axios
    .get(
      `https://www.omdbapi.com/?apikey=3430a78&t=${encodeURIComponent(
        title
      )}&plot=full`
    )
    .then(result => {
      console.log(result);
      releasedDate = result.data.Released;
      genre = result.data.Genre;
      movieHTML.push(`<p>${releasedDate}</p>`);
      movieHTML.push(`<p>${genre}</p>`);
      ratings = result.data.Ratings.map(e => {
        return movieHTML.push(`<p>${e.Source}: ${e.Value}</p>`);
      });
    })
    .then(() => {
      movieHTML.push(
        `<button class="btn-outline-secondary" onClick="recommend('${title}')">Recommendations</button>`
      );
      targetDiv.innerHTML = movieHTML.join("");
    });
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
          console.log(res);
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

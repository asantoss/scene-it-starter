const db = firebase.firestore();

var userWatchlist = db.collection("users")



function addFav(title, element, id) {
    console.log(title)
    let buttonHTML = document.getElementById(element);
    id = element.split('B')[0];
    let encondedSearchString = encodeURIComponent(title);
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=231ff08007c871881760666607644536&query=${encondedSearchString}`)
        .then(response => {
            return currentMovie = response.data.results[0]
        })
        .then(movie => {
            userWatchlist.doc(uid).update({
                watchlist: firebase.firestore.FieldValue.arrayUnion(movie)
            })
        })
    // if (movieData != undefined) {
    //     let currentMovie = movieData.find(movie => {
    //         return movie.title === title;
    //     });
    // }
    // for (let i = 0; i < watchlist.length; i++) {
    //     let element = watchlist[i];
    //     if (element.title === title) {
    //         return;
    //     }
    // }
    // watchlist.push(currentMovie);
    // saveLocalStorage("watchlist", watchlist);

    return (buttonHTML.innerHTML = `<button onclick="removeFav('${id}','${id}Buttons')" class="btn btn-danger" id="tt1345836button">Remove</button>`);
}

function removeFav(title, element, id) {
    let buttonHTML = document.getElementById(element);
    let encondedSearchString = encodeURIComponent(title);
    console.log(encondedSearchString)
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=231ff08007c871881760666607644536&query=${encondedSearchString}`)
        .then(response => {
            return currentMovie = response.data.results[0]
        })
        .then(movie => {
            userWatchlist.doc(uid).update({
                watchlist: firebase.firestore.FieldValue.arrayRemove(movie)
            })
        })
    return (buttonHTML.innerHTML = `<button onclick="addFav('${title}','${id}Buttons','${id}')" class="btn btn-success" id="tt1345836button">Add</button>`);
}
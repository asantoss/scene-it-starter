//Input the firebase code here
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//The above object will only use a few of the auth providers
var ui = new firebaseui.auth.AuthUI(firebase.auth());

// When the user clicks on the button, open the modal 
btn.onclick = function (e) {
    e.preventDefault()
    modal.style.display = "block";
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
}


var name;
var email;
var uid;

//This is out authentication object
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;
        // User is signed in.
        watchlist = userWatchlist.doc(uid).onSnapshot(function (doc) {
            var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            console.log(source, " data: ", doc.data()['watchlist']);
            watchlist = doc.data()['watchlist'];
        });
        document.getElementById('authTarget').innerHTML = `<a href="./pages/watchlist.html" class="btn btn-secondary align-self-center" onClick="signOut()">Watchlist</a><a class="btn btn-secondary align-self-center" onClick="signOut()">Sign Out</a>`
    } else {
        // No user is signed in.

    }
});

var signOut = function () {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        location = "./index.html"
    }).catch(function (error) {
        // An error happened.
    });
}
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            modal.style.display = "none";
            return false;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            // document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
};
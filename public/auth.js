firebase.auth().onAuthStateChanged(function(user) {
  window.user = user;
  if (user) {
    
  } else {
    // No user is signed in.
    signIn();
  }
});


function signIn() {
  
  var provider = new firebase.auth.GoogleAuthProvider();
  
  firebase.auth().signInWithRedirect(provider);
}
console.log('running routes.js');
addRoute('home').then(() => $.router.go('home'), () => {
  alert('falid to add route home');
});
addRoute('lobby');

console.log('running routes.js');
addRoute('/home', 'home').then(() => $.router.go('/home'), () => {
  alert('falid to add route home');
});
addRoute('/lobby', 'lobby');
addRoute('/game/:gameId', 'game');

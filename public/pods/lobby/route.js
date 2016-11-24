window.lobbyRoute = (renderView) => {
  db.ref(`games`).once('value', snapshot => {
    renderView({greeting: 'Lobby!', games: snapshot.val()});
  })
};
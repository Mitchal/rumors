function lobbyRoute(renderView) {
  db.ref(`games`).on('value', snapshot => {
    renderView({greeting: 'Lobby!', games: snapshot.val()});
  })
}
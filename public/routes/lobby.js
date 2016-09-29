function lobbyRoute(renderView) {
  db.ref(`games`).on('value', snapshot => {
    games = renderGames(snapshot.val());
    renderView({greeting: 'Lobby!', games});
  })
}

function renderGames(games) {
  var $ul = $('<ul></ul>');
  Object.keys(games).forEach(gameId => {
    const game = games[gameId];
    $ul.append(`<li class="lobby__game" data-gameid="${gameId}">${gameId}</li>`);
  });
  return $ul[0].outerHTML;
}
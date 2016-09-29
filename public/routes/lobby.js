function lobbyRoute(renderView) {
  games = renderGames();
  renderView({greeting: 'Lobby!', games});
}

function renderGames() {
  var $ul = $('<ul></ul>');
  $ul.append('<li>game1</li>');
  return $ul[0].outerHTML;
}
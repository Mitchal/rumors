window.lobbyController = (view, data) => {
  view.find('.lobby__create-game')
    .click(createGame);

  renderGames(view.find('.lobby__games'), data.games);
};

function createGame() {
  console.log('creating new game');
  const gameId = db.ref('games').push().key;
  db.ref(`games/${gameId}`).set({
    id: gameId,
    status: 'setup',
    currentTurn: 0
  });
}

function renderGames($ul, games) {
  if (!games) {
    return;
  }
  Object.keys(games).forEach(gameId => {
    $ul.append(renderGame(games[gameId]));
  });
}

function renderGame(game) {
  const gameId = game.id;

  const li = $(`<li class="lobby__game" data-gameid="${gameId}">${gameId}</li>`);

  li.click(function () {
    joinGame(gameId);
  });

  return li;
}

function joinGame(gameId) {
  const userId = window.user && window.user.uid;
  if (!userId) {
    throw new Error('no user id');
  }

  db.ref(`games/${gameId}/players/${userId}`).set({turns: {0: {mode: 'draw', word: 'football', lines: [], isDone: false}}});
  db.ref(`players/${userId}/currentGame`).set(gameId);
  $.router.go(`/game/${gameId}`);
}
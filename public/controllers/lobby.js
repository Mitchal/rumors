function lobbyController(view) {
  view.find('.lobby__create-game').click(() => {
    console.log('creating new game');
    const gameId = db.ref('games').push().key;
    db.ref(`games/${gameId}`).set({
      id: gameId,
      status: 'setup'
    });
  });

  view.find('.lobby__game').click(function () {
    const gameId = $(this).data('gameid');
    joinGame(gameId);
  });
}

function joinGame(gameId) {
  const userId = window.user && window.user.uid;
  if (!userId) {
    throw new Error('no user id');
  }

  db.ref(`games/${gameId}/players`).push(userId);
  db.ref(`players/${userId}/currentGame`).set(gameId);
  $.router.go(`/game/${gameId}`);
}
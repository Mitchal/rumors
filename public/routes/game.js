function gameRoute(renderView, data) {
  console.log('GameRoute');
  const gameId = data.gameId;
  db.ref(`/games/${gameId}`).on('value', snapshot => {
    renderView({
      id: gameId,
      wordToDraw: 'programmer'
    });
  })
}
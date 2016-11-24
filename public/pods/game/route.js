var gameId;

window.gameRoute = (renderView, data) => {
  console.log('GameRoute');
  gameId = data.gameId;
  getGameDbRef().on('value', snapshot => {
    const game = snapshot.val();
    const currentTurn = game.currentTurn;

    const turn = game.players[window.user.uid].turns[currentTurn];

    renderView({
      gameId,
      turn,
      saveLines
    });

    if (turn.mode === 'draw' && !turn.isDone) {
      beginDrawCountdown();
    }
  });
};

function getGameDbRef() {
  return db.ref(`/games/${gameId}`);
}

function saveLines(lines) {
  const gameDbRef = getGameDbRef();
  gameDbRef.once('value', snapshot => {
    const game = snapshot.val();
    gameDbRef.update({ [`/players/${window.user.uid}/turns/${game.currentTurn}/lines`]: lines});
  });
}

function beginDrawCountdown() {
  const startTime = Date.now();

  const tick = () => {
    if (Date.now() - startTime > 5000) {
      setPlayerIsDone();
    }
    else {
      setTimeout(tick, 1000);
    }
  };

  tick();
}

function setPlayerIsDone() {
  const gameDbRef = getGameDbRef();
  gameDbRef.once('value', snapshot => {
    const game = snapshot.val();
    gameDbRef.update({ [`/players/${window.user.uid}/turns/${game.currentTurn}/isDone`]: true})
      .then(endTurnIfAllPlayersAreDone);
  });
}


function endTurnIfAllPlayersAreDone() {
  const gameDbRef = getGameDbRef();

  gameDbRef.once('value', snapshot => {
    const game = snapshot.val();
    const currentTurn = game.currentTurn;

    gameDbRef.child('players').once('value', playersSnapshot => {
      const playerSnapshots = [];
      const oneIsNotDone = playersSnapshot.forEach((playerSnapshot) => {
        const player = playerSnapshot.val();
        if (!player.turns[currentTurn].isDone) {
          return true;
        }
        playerSnapshots.push(playerSnapshot);
      });

      if (!oneIsNotDone) {
        gameDbRef.child('currentTurn').transaction(currentTurn => {
          const nextTurn = currentTurn + 1;

          var n = playerSnapshots.length;
          for (var i = 0; i < n; i++) {
            var playerSnapshot = playerSnapshots[i];
            var nextIndex = (i === n-1) ? 0 : i + 1;
            var nextPlayerSnapshot = playerSnapshots[nextIndex];
            nextPlayerSnapshot.ref.child(`/turns/${nextTurn}/`).set({mode: 'guess', lines: playerSnapshot.val().turns[currentTurn].lines, isDone: false});
          }

          return nextTurn;
        });
      }

    });

  });
}
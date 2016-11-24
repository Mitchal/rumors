var gameId;

window.gameRoute = (renderView, data) => {
  console.log('GameRoute');
  gameId = data.gameId;
  getPlayerDbRef().on('value', snapshot => {
    const player = snapshot.val() || {};
    const turn = player.turns[player.currentTurn];

    renderView({
      gameId,
      turn,
      saveLines
    });

    if (turn.mode === 'draw') {
      beginDrawCountdown();
    }
  });
};

function getPlayerDbRef() {
  return db.ref(`/games/${gameId}/players/${window.user.uid}`);
}

function saveLines(lines) {
  const playerDbRef = getPlayerDbRef();
  playerDbRef.once('value', snapshot => {
    const player = snapshot.val();
    playerDbRef.update({ [`/turns/${player.currentTurn}/lines`]: lines});
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
  const playerDbRef = getPlayerDbRef();
  playerDbRef.once('value', snapshot => {
    const player = snapshot.val();
    playerDbRef.update({ [`/turns/${player.currentTurn}/isDone`]: true});
  });
}
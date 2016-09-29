function gameController(view) {
  let isDrawing = false;
  let lines = [];
  let currentLine = [];
  lines.push(currentLine);

  const $canvas = view.find('.game__canvas');
  const canvas = $canvas[0];
  const canvasContext = getCanvasContext(canvas);

  $canvas
    .mousedown(e => {
      isDrawing = true;
      const point = getMousePos(canvas, e);
      canvasContext.moveTo(point[0], point[1]);
    })
    .mousemove(e => {
      if (isDrawing) {
        const point = getMousePos(canvas, e);
        currentLine.push(point);
        canvasContext.lineTo(point[0], point[1]);
        canvasContext.stroke();
      }
    });

  $(document).mouseup(() => {
    isDrawing = false;
    currentLine = [];
    lines.push(currentLine);
  });
}

function getCanvasContext(canvas) {
  const result = canvas.getContext('2d');
  result.lineWidth = 7;
  result.lineJoin = result.lineCap = 'round';
  return result;
}

function renderPoints(canvasContext, lines) {
  for (var i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (var j = 1; j < line.length; j++) {
      canvasContext.lineTo(line[j][0], line[j][1]);
    }
    canvasContext.stroke();
  }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return [
    evt.clientX - rect.left,
    evt.clientY - rect.top
  ];
}

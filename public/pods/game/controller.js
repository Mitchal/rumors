window.gameController = (view, data) => {
  const lines = data.turn.lines || [];
  renderLines(view, lines);

  if (!data.turn.isDone) {
    enableDrawing(view, lines, data);
  }
};

function enableDrawing(view, lines, data) {
  let isDrawing = false;
  let currentLine = [];

  const canvasContext = getCanvasContext(view);
  const canvas = canvasContext.canvas;
  const $canvas = $(canvas);

  const mouseDownHandler = e => {
    console.log("MOUSE DOWN IN CANVAS");
    isDrawing = true;
    const point = getMousePos(canvas, e);
    canvasContext.moveTo(point[0], point[1]);
    $canvas.off('mousedown', mouseDownHandler);
    $canvas.on('mousemove', mouseMoveHandler);
  };

  const mouseMoveHandler = e => {
    if (isDrawing) {
      const point = getMousePos(canvas, e);
      currentLine.push(point);
      canvasContext.lineTo(point[0], point[1]);
      canvasContext.stroke();
    }
  };

  const mouseUpHandler = () => {
    console.log("MOUSE UP IN DOCUMENT");
    isDrawing = false;
    lines.push(currentLine);
    data.saveLines(lines);
    currentLine = [];
    $(document).off('mouseup', mouseUpHandler);
    $canvas.off('mousemove', mouseMoveHandler);
  };

  $canvas.on('mousedown', mouseDownHandler);

  $(document).on('mouseup', mouseUpHandler);
}

function getCanvasContext(view) {
  const $canvas = view.find('.game__canvas');
  const canvas = $canvas[0];
  const result = canvas.getContext('2d');
  result.lineWidth = 7;
  result.lineJoin = result.lineCap = 'round';
  return result;
}

function renderLines(view, lines) {
  const canvasContext = getCanvasContext(view);

  for (var i = 0; i < lines.length; i++) {
    const line = lines[i];
    const firstPoint = line[0];
    canvasContext.moveTo(firstPoint[0], firstPoint[1]);

    for (var j = 1; j < line.length; j++) {
      const point = line[j];
      canvasContext.lineTo(point[0], point[1]);
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
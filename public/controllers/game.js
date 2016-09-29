function gameController(view) {
  let isDrawing = false;
  let points = [];

  const canvas = view.find('.game__canvas');
  const canvasContext = getCanvasContext(canvas);

  canvas
    .mousedown(e => {
      isDrawing = true;
    })
    .mousemove(e => {
      if (isDrawing) {
        console.log('drawing');
        const point = [e.offsetX, e.offsetY];
        points.push(point);
        renderPoints(canvasContext, points);
      }
    })

}

function getCanvasContext(canvas) {
  const result = canvas[0].getContext('2d');
  result.lineWidth = 10;
  result.lineJoin = result.lineCap = 'round';
  return result;
}

function renderPoints(canvasContext, points) {
  canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
  canvasContext.beginPath();
  canvasContext.moveTo(points[0][0], points[0][1]);
  for (var i = 1; i < points.length; i++) {
    console.log('rendering point', points[i][0], points[i][1]);
    canvasContext.lineTo(points[i][0], points[i][1]);
  }
  canvasContext.stroke();

}
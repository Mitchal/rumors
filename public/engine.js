
function addRoute(path, name) {
  name = name.toLowerCase();
  
  return $.getScript(`/pods/${name}/route.js`).then(() => {
    return $.getScript(`/pods/${name}/controller.js`).then(() => {
      doAddRoute(path, name);
    });
  });
}

function doAddRoute(path, name) {
  console.log('adding', name, 'at path', path);

  $.router.add(path, name, function (data) {

    const renderViewIntoMainOutlet = (augmentedData) => {
      renderViewWithData(name, augmentedData).then(view => {
        passViewThroughController(name, view, augmentedData);
        connectViewToMainOutlet(view);
      });
    };
    passViewRenderingToRoute(name, renderViewIntoMainOutlet, data);
  });
}

function passViewRenderingToRoute(name, renderViewIntoMainOutlet, data) {
  const routeFunctionName = name + 'Route';
  const routeFunction = window[routeFunctionName];
  return routeFunction(renderViewIntoMainOutlet, data);
}

function renderViewWithData(name, data) {
  return new Promise(resolve => {
    console.log('rendering', name);
    $.get(`/pods/${name}/template.html`, template => {
      template = `<div class="${name}-template">${template}</div>`;
      console.log('RENDERING:');
      console.log(nano(template, data));
      const view = $(nano(template, data));
      resolve(view);
    });
  });
}

function connectViewToMainOutlet(view) {
  $('#outlet-main').html(view);
}

function passViewThroughController(name, view, data) {
  const controllerFunctionName = name + 'Controller';
  const controllerFunction = window[controllerFunctionName];
  if (typeof controllerFunction === 'function') {
      controllerFunction(view, data);
  }
  else {
    console.warn('could not find controller function "' + controllerFunctionName + '"');
  }
}
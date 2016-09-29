
function addRoute(name) {
  name = name.toLowerCase();
  
  return $.getScript(`/routes/${name}.js`).then(() => {
    console.log('got route for', name);
    return $.getScript(`/controllers/${name}.js`).then(() => {
      doAddRoute(name);
    });
  });
}

function doAddRoute(name) {
  console.log('adding', name);
    
  const path = `/${name}`;
  
  $.router.add(path, name, function (data) {

    const renderViewIntoMainOutlet = (augmentedData) => {
      renderViewWithData(name, augmentedData).then(view => {
        passViewThroughController(name, view);
        connectViewToMainOutlet(view);
      });
    };
    passViewRenderingToRouter(name, renderViewIntoMainOutlet, data);
  });
}

function passViewRenderingToRouter(name, renderViewIntoMainOutlet, data) {
  const routeFunctionName = name + 'Route';
  const routeFunction = window[routeFunctionName];
  return routeFunction(renderViewIntoMainOutlet, data);
}

function renderViewWithData(name, data) {
  return new Promise(resolve => {
    console.log('rendering', name);
    $.get(`/templates/${name}.html`, template => {
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

function passViewThroughController(name, view) {
  const controllerFunctionName = name + 'Controller';
  const controllerFunction = window[controllerFunctionName];
  if (typeof controllerFunction === 'function') {
      controllerFunction(view);
  }
  else {
    console.warn('could not find controller function "' + controllerFunctionName + '"');
  }
}
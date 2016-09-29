
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
    const augmentedData = passDataThroughRouter(name, data);
    renderViewWithData(name, augmentedData).then(view => {
       passViewThroughController(name, view);
    });
  });
}

function passDataThroughRouter(name, data) {
  const routeFunctionName = name + 'Route';
  const routeFunction = window[routeFunctionName];
  return routeFunction(data);
}

function renderViewWithData(name, data) {
  return new Promise(resolve => {
    console.log('rendering', name);
    $.get(`/templates/${name}.html`, template => {
      template = `<div class="${name}-template">${template}</div>`;
      console.log('RENDERING:');
      console.log(nano(template, data));
      const view = $(nano(template, data));
      $('#outlet-main').html(view);
      resolve(view);
    });
  });
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
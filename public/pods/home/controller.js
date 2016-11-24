window.homeController = (view) => {
  view.find('button').click(() => {
    $.router.go('lobby');
  });
};
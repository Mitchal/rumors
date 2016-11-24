window.homeRoute = (renderView) => {
  console.log('HomeRoute');
  const name = window.user ? window.user.displayName : 'you';
  renderView({
    greeting: `Hello ${name}!`
  });
};
const urlRoute = (router, types, blockTypes = []) => {
  let [, path] = router.route.split('/');
  let permission = null;
  let hasPermission = true;

  const { asPath } = router;
  const oldPath = path;

  let routesList = {};

  if (path === 'propriedades') {
    routesList = {
      tecnico: '/tecnico/propriedades',
      administrador: '/admin/propriedades'
    };
  }

  Object.keys(routesList).forEach(type => {
    const route = routesList[type];

    if (asPath.startsWith(route)) {
      hasPermission = false;

      if (type === types && !blockTypes.includes(types)) {
        path = route;
        permission = type;
        hasPermission = true;
      }
    }
  });

  if (oldPath === path) path = `/${path}`;

  return { path, permission, hasPermission };
};

export default urlRoute;

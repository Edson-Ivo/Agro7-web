const urlRoute = (router, types) => {
  let [, path] = router.route.split('/');
  let permission = null;
  let hasPermission = true;

  const { asPath } = router;
  const oldPath = path;

  let routesList = {};

  if (path === 'propriedades') {
    routesList = {
      technical: '/tecnico/propriedades'
    };
  }

  Object.keys(routesList).forEach(type => {
    const route = routesList[type];

    if (asPath.startsWith(route)) {
      hasPermission = false;

      if (type === types) {
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

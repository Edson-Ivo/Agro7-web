const urlRoute = (router, types, blockTypes = []) => {
  let [, path] = router.route.split('/');
  let permission = null;
  let hasPermission = true;

  const { asPath } = router;
  const oldPath = path;

  let routesList = {};

  const typesSave = types;

  if (types === 'tecnico produtor') types = 'tecnico';

  if (path === 'propriedades') {
    routesList = {
      tecnico: ['/tecnico/propriedades'],
      administrador: [
        '/admin/propriedades',
        '/admin/users/[userId]/propriedades',
        '/admin/users/[userId]/tecnico/propriedades'
      ]
    };
  } else if (path === 'caderno-produtor') {
    routesList = {
      administrador: ['/admin/users/[userId]/caderno-produtor']
    };
  } else if (path === 'vendas') {
    routesList = {
      administrador: ['/admin/vendas', '/admin/users/[userId]/vendas']
    };
  } else if (path === 'insumos') {
    routesList = {
      administrador: ['/admin/users/[userId]/insumos']
    };
  }

  Object.keys(routesList).forEach(type => {
    const route = routesList?.[type];

    route.forEach(r => {
      const queried = replaceQuery(r, router.query);

      if (asPath.startsWith(queried)) {
        hasPermission = false;

        if (type === types && !blockTypes.includes(types)) {
          path = queried;
          permission = typesSave;
          hasPermission = true;
        }
      }
    });
  });

  if (oldPath === path) path = `/${path}`;

  return { path, permission, hasPermission };
};

const replaceQuery = (asPath, query) => {
  const pathList = asPath.split('/');
  let path = asPath;

  Object.keys(query).forEach(q => {
    const value = query[q];
    const keyQuery = `[${q}]`;

    if (pathList.includes(keyQuery)) path = path.replaceAll(keyQuery, value);
  });

  return path;
};

export { replaceQuery };
export default urlRoute;

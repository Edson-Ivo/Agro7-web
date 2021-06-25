import objectKeyExists from './objectKeyExists';
import namedRoutes from './routes';
import { replaceQuery } from './urlRoute';

const breadcrumbRouter = (router, titles = []) => {
  const { asPath } = router;
  const path = replaceQueryValue(escapePath(asPath), router.query)
    .split('/')
    .filter(x => x !== '');

  const list = namedRoutes;

  const breadcrumb = [{ name: 'Home', route: '/' }];
  let crop = false;
  let pathed = '';

  path.forEach(p => {
    pathed = `${pathed}/${p}`;

    if (objectKeyExists(list, pathed)) {
      const pList = list?.[pathed];

      breadcrumb.push({
        name: replaceTitle(pList?.name, titles),
        route: replaceQuery(pList?.path || pathed, router.query)
      });
    }
  });

  const pathLength = breadcrumb.length;
  let newPath = breadcrumb;

  if (pathLength > 8) {
    crop = true;
    newPath = [
      ...newPath.slice(0, 4),
      ...newPath.slice(pathLength - 4, pathLength)
    ];
  }

  return { path: newPath, crop };
};

const replaceQueryValue = (asPath, query) => {
  const path = asPath.split('/');

  Object.keys(query).forEach(q => {
    const value = query[q];
    const index = path.indexOf(value);

    if (index !== -1) path[index] = `[${q}]`;
  });

  return path.join('/');
};

const replaceTitle = (title, titles) =>
  objectKeyExists(titles, title) ? titles?.[title] : title;

const escapePath = path => {
  const p = path;
  const n = path.indexOf('?');

  return p.substring(0, n !== -1 ? n : p.length);
};

export default breadcrumbRouter;

import isEmpty from './isEmpty';

const mountQuery = (
  router,
  url = '',
  queryParams = {},
  blockedQueryList = [],
  allowedQueryList = [],
  allowedEmpty = true
) => {
  let newQuery = [];
  let { query } = router;
  const { pathname } = router;
  const params = pathname.split('/');

  query = {
    ...query,
    ...queryParams
  };

  const blocked = [
    'id',
    'userId',
    'fieldId',
    'docId',
    'cultureId',
    'actionId',
    'harvestId',
    'vehicleId',
    'typeAction'
  ].concat(blockedQueryList);

  Object.entries(query).forEach(([type, q]) => {
    if (
      !blocked.includes(type) ||
      (allowedQueryList && allowedQueryList.includes(type))
    ) {
      if ((allowedEmpty && isEmpty(q)) || !isEmpty(q)) {
        const t = `[${type}]`;

        if (!params.includes(t))
          newQuery.push(`${type}=${encodeURIComponent(q)}`);
      }
    }
  });

  newQuery = newQuery.length ? `?${newQuery.join('&')}` : '';

  return `${url || pathname}${newQuery}`;
};

export default mountQuery;

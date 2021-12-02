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

  query = {
    ...query,
    ...queryParams
  };

  Object.keys(query).forEach(type => {
    const q = query?.[type];

    if (
      !blockedQueryList.includes(type) ||
      (allowedQueryList && allowedQueryList.includes(type))
    ) {
      if ((allowedEmpty && isEmpty(q)) || !isEmpty(q))
        newQuery.push(`${type}=${encodeURIComponent(q)}`);
    }
  });

  newQuery = newQuery.length ? `?${newQuery.join('&')}` : '';

  return `${url || pathname}${newQuery}`;
};

export default mountQuery;

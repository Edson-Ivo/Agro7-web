import isEmpty from './isEmpty';

const objectToQuery = obj => {
  const newQuery = [];

  Object.keys(obj).forEach(type => {
    const q = obj?.[type];

    if (!isEmpty(q)) newQuery.push(`${type}=${encodeURIComponent(q)}`);
  });

  return newQuery.join('&');
};

export default objectToQuery;

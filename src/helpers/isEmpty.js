const isEmpty = obj => {
  if (obj != null && !(obj?.length === 0))
    return Object.keys(obj).length === 0 && obj.constructor === Object;

  return true;
};

const isArrayOfEmpty = array => {
  if (Array.isArray(array)) return array.every(el => isEmpty(el));

  return false;
};

export { isArrayOfEmpty };
export default isEmpty;

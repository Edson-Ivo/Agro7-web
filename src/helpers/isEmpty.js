const isEmpty = obj => {
  if (obj != null && !(obj?.length === 0))
    return Object.keys(obj).length === 0 && obj.constructor === Object;

  return true;
};

export default isEmpty;

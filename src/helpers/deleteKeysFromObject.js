const deleteKeysFromObject = (keys = [], obj) => {
  keys.forEach(key => {
    delete obj?.[key];
  });
};

export default deleteKeysFromObject;

const maskString = (value, pattern) => {
  let i = 0;
  let pat = pattern;
  const v = value.toString();

  if (pat === 'phone') pat = '(##) #####-####';

  return pat.replace(/#/g, () => v[i++] || '');
};

export default maskString;

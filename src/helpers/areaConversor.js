const areaConversor = (area, dimension) => {
  if (dimension === 'ha') area /= 10000;
  if (dimension === 'km') area /= 1000000;

  return parseFloat(area).toFixed(2);
};

export default areaConversor;

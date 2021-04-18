export const isLight = hexColor => {
  const hex = hexColor.replace('#', '');

  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  if (hex.length === 3) {
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(1, 2), 16);
    b = parseInt(hex.substr(2, 2), 16);
  }

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 155;
};

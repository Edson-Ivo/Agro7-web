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

export const colorShade = (col, amt = -40, rgba = false, alpha = 1) => {
  col = col.replace(/^#/, '');
  if (col.length === 3)
    col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

  let [r, g, b] = col.match(/.{2}/g);
  [r, g, b] = [
    parseInt(r, 16) + amt,
    parseInt(g, 16) + amt,
    parseInt(b, 16) + amt
  ];

  if (rgba) return `rgba(${r}, ${g}, ${b}, ${alpha})`;

  r = Math.max(Math.min(255, r), 0).toString(16);
  g = Math.max(Math.min(255, g), 0).toString(16);
  b = Math.max(Math.min(255, b), 0).toString(16);

  const rr = (r.length < 2 ? '0' : '') + r;
  const gg = (g.length < 2 ? '0' : '') + g;
  const bb = (b.length < 2 ? '0' : '') + b;

  return `#${rr}${gg}${bb}`;
};

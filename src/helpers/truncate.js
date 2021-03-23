const truncate = (input, maxLength) =>
  input.length > maxLength ? `${input.substring(0, maxLength)}...` : input;

export default truncate;

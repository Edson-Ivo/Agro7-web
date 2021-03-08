const errorMessage = error =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.data.message ||
  error.toString();

export default errorMessage;

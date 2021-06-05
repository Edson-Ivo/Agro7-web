const extractNumbers = string => (string ? string.replace(/\D/g, '') : string);

export default extractNumbers;

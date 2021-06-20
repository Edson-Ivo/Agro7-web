const truncate = (input, maxLength) =>
  input.length > maxLength ? `${input.substring(0, maxLength)}...` : input;

export const truncateProducerNotebook = (input, isMobile) => {
  const maxLength = !isMobile ? 490 : 280;
  const reduceSize = !isMobile ? 98 : 42;

  if (input.length <= maxLength) return input;

  const breakedLines = checkBreaksLines(input);
  const reduceLength = reduceSize * (breakedLines > 3 ? 3 : breakedLines);

  return `${input.substring(0, maxLength - reduceLength)}...`;
};

const checkBreaksLines = input => {
  try {
    return input.match(/[^\n]*\n[^\n]*/gi).length;
  } catch (e) {
    return 0;
  }
};

export default truncate;

const scrollTo = ref => {
  if (ref.current !== null && window !== 'undefined') {
    const headerOffset = 100;
    const elementPosition = ref.current.offsetTop;
    const offsetPosition = elementPosition - headerOffset;

    setTimeout(() => {
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }, 300);
  }
};

export default scrollTo;

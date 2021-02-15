import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  });
  const [size] = useDebounce(windowSize, 500);

  function handleResize() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);

      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }

    return undefined;
  }, []);

  return size;
};

export default useWindowSize;

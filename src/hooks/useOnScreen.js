import 'intersection-observer';

import { useState, useEffect } from 'react';
import isEmpty from '@/helpers/isEmpty';

const useOnScreen = ref => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!isEmpty(ref?.current)) {
      const observer = new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
      );

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }

    return () => null;
  }, []);

  return isIntersecting;
};

export default useOnScreen;

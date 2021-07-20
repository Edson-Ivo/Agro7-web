import { useEffect, useState } from 'react';

const useWebShareApi = (onShareSuccess, onShareError) => {
  const [isSupported, setSupported] = useState(false);

  const share = (text, title, url) => {
    if (isSupported) {
      window?.navigator
        .share({
          title,
          text,
          url: url || window.location.href || ''
        })
        .then(res => {
          if (res) onShareSuccess(res);
        })
        .catch(error => {
          if (error) onShareError(error);
        });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window?.navigator?.share)
      setSupported(true);
  }, []);

  return [isSupported, share];
};

export default useWebShareApi;

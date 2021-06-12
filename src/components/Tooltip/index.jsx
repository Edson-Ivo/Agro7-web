import React, { useEffect, useRef } from 'react';

import { TooltipContainer } from './styles';

function useOutsideAlerter(ref) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        ref.current.click();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

const Tooltip = ({ opened = false, handleClick, children }) => {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    opened && (
      <TooltipContainer ref={wrapperRef} onClick={handleClick}>
        <div>{children}</div>
      </TooltipContainer>
    )
  );
};

export default Tooltip;

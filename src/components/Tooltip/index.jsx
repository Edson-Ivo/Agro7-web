import React, { useEffect, useRef } from 'react';

import { TooltipContainer } from './styles';

const Tooltip = ({
  opened = false,
  handleClick,
  position = 'right',
  minHeight = 'auto',
  minWidth = 225,
  responsive = false,
  onClickOutside = () => null,
  children
}) => {
  const ref = useRef(null);

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) onClickOutside();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);

  return (
    opened && (
      <TooltipContainer
        ref={ref}
        onClick={handleClick}
        position={position}
        minHeight={minHeight}
        minWidth={minWidth}
        responsive={responsive}
      >
        <div>{children}</div>
      </TooltipContainer>
    )
  );
};

export default Tooltip;

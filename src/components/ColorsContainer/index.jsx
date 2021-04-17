import React from 'react';
import styled from 'styled-components';

export const ColorFill = styled.div`
  background: ${props => `#${props.fillColor}`};
  border-radius: 9999px;
  display: flex;
  height: 35px;
  width: 35px;
`;

const ColorsContainer = ({ fillColor, size, nameColor = '' }) => (
  <>
    <ColorFill fillColor={fillColor} size={size} />
    {nameColor && <p>{nameColor}</p>}
  </>
);

export default ColorsContainer;

import React from 'react';
import styled from 'styled-components';

export const ColorFill = styled.div`
  background: ${props => `#${props.fillColor}`};
  border-radius: 9999px;
  display: flex;
  height: ${props => props.size || 90}px;
  width: ${props => props.size || 90}px;
`;

export const ColorViewer = styled.div`
  align-items: center;
  background: ${props => `#${props.fillColor}`};
  color: ${props =>
    props.isLight ? props.theme.colors.black : props.theme.colors.white};
  border-radius: 10px;
  display: flex;
  height: 150px;
  font-size: 1.25em;
  justify-content: center;
  width: 100%;
`;

const ColorsContainer = ({ fillColor, size, nameColor = '' }) => (
  <>
    <ColorFill fillColor={fillColor} size={size} />
    {nameColor && <p>{nameColor}</p>}
  </>
);

export default ColorsContainer;

import React from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export const ColorFill = styled.div`
  background: ${props => `#${props.fillColor}`};
  border-radius: 9999px;
  cursor: pointer;
  display: flex;
  height: ${props => props.size || 90}px;
  position: relative;
  width: ${props => props.size || 90}px;
  transform: scale(${props => (props.selected ? 1.2 : 1.0)});
  transition: transform 100ms ease 0s;
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

export const ColorsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -14px;
  margin-bottom: -14px;

  & > div {
    width: 45px;
    height: 45px;
    margin-right: 14px;
    margin-bottom: 14px;

    :hover {
      transform: scale(1.2);
    }
  }
`;

export const ColorFillSelected = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.white};
  border-radius: 99999px;
  display: flex;
  align-items: center;
  font-size: 1.25em;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const ColorsContainer = ({
  fillColor,
  size,
  title = '',
  selected = false,
  onClick = null
}) => (
  <>
    <ColorFill
      fillColor={fillColor}
      size={size}
      title={title}
      selected={selected}
      onClick={onClick}
    >
      {selected && (
        <ColorFillSelected>
          <FontAwesomeIcon icon={faCheck} className="card-icon" />
        </ColorFillSelected>
      )}
    </ColorFill>
  </>
);

export default ColorsContainer;

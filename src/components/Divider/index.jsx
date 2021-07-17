import React from 'react';
import styled from 'styled-components';

const DividerContainer = styled.div`
  width: 100%;
  border-top: 1px solid ${props => props.theme.colors.border};
  line-height: 1px;
  position: relative;
  margin: 20px 0;
  text-align: center;

  strong {
    background-color: ${props => props.theme.colors.background};
    letter-spacing: 2px;
    line-height: 0;
    padding: 0 20px;
    text-transform: uppercase;
  }
`;

const Divider = ({ children }) => (
  <DividerContainer>
    <strong>{children}</strong>
  </DividerContainer>
);

export default Divider;

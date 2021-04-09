import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: ${props => (props.hidden ? 'none' : 'block')};
`;

export default function Step({ children, ...rest }) {
  return <Container {...rest}>{children}</Container>;
}

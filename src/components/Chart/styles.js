import styled from 'styled-components';

export const ChartContainer = styled.div`
  max-height: ${props => props.height}px;
  margin: 0 auto;
  margin-bottom: 32px;
  position: relative;
  width: 100%;
`;

export const ChartTitle = styled.h4`
  margin: 10px 0 16px 0;
  text-align: center;
`;

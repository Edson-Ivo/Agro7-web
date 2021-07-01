import styled from 'styled-components';

export const CardContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.05);
  width: 100%;
  margin-bottom: 24px;
  overflow: hidden;

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    border-radius: 0px;
    margin-bottom: 0px;
  }
`;

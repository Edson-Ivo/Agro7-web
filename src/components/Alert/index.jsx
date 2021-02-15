import styled from 'styled-components';

export const Alert = styled.div`
  color: ${props => props.theme.colors.white};
  display: flex;
  flex-direction: row;
  width: 100%;
  background: ${props => props.theme.colors.red};
  font-weight: 700;
  border-radius: 10px;
  padding: 20px;
  overflow: hidden;
  margin-bottom: 10px;
`;

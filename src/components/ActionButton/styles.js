import styled from 'styled-components';

export const ActionButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  > div {
    cursor: pointer;
    padding: 10px;
    margin-right: 10px;
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    a {
      color: ${props => props.theme.colors.black};
    }
  }
`;

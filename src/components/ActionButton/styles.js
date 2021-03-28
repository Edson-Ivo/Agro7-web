import styled from 'styled-components';

export const ActionButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 100%;

  > div,
  > a {
    cursor: pointer;
    padding: 10px;
    margin-left: 10px;
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.black};
    font-size: 16px;
    border-radius: 50%;
    transition: all ease-in 0.2s;

    &:hover {
      background: ${props => props.theme.colors.black_10};
      color: ${props => props.theme.colors.primary};
    }
  }
`;

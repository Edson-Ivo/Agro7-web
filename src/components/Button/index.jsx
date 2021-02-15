import styled from 'styled-components';

const Button = styled.button`
  border: 0;
  width: 100%;
  height: 55px;
  background: ${props => props.theme.colors.gray};
  border-radius: 10px;
  color: ${props => props.theme.colors.black};
  margin: 5px auto;
  transition: all 0.25s;

  &.active {
    background: ${props => props.theme.colors.primary}!important;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    color: ${props => props.theme.colors.white}!important;
  }

  &.green {
    background: ${props => props.theme.colors.green}!important;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    color: ${props => props.theme.colors.white}!important;
  }

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
  }
`;

export default Button;

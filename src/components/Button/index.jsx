import styled from 'styled-components';

const Button = styled.button`
  border: 0;
  width: 100%;
  height: 50px;
  background: transparent;
  border-radius: 10px;
  color: ${props => props.theme.colors.black};
  margin: 5px auto;
  transition: all 0.3s;
  opacity: 0.9;
  border: 1px solid ${props => props.theme.colors.black_25};

  &.primary {
    background: ${props => props.theme.colors.primary}!important;
    color: ${props => props.theme.colors.white}!important;
  }

  &.green {
    background: ${props => props.theme.colors.green}!important;
    color: ${props => props.theme.colors.white}!important;
  }

  &:hover {
    border: 1px solid ${props => props.theme.colors.primary};
    opacity: 1;
  }
`;

export default Button;

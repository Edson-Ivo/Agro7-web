import styled from 'styled-components';
import { animated } from 'react-spring';

export const Container = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;

  position: fixed;
`;

export const Content = styled(animated.div)`
  position: absolute;
  top: 25%;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 101;
  background: #fff;
  box-shadow: 0px 16px 24px rgb(0 0 0 / 10%);
  border-radius: 0.25em;
  height: auto !important;

  max-width: 400px;

  > button {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 16px;
    height: 16px;
    border: 0;
    background: transparent;
    color: #adb5bd;
    transition: 0.2s color;

    &:hover {
      color: #353b41;
    }
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1em;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: 0.3em;
  border-top-right-radius: 0.3em;

  background: #f8f9fa;

  h5 {
    font-weight: 600;
    margin-top: 0;

    font-size: 1.25em;

    margin-bottom: 0;
    line-height: 1.5;
  }
`;

export const Body = styled.div`
  position: relative;
  flex: 1 1 auto;
  padding: 1em;

  p {
    margin-top: 0;
    margin-bottom: 1em;
  }
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1em;
  border-top: 1px solid #dee2e6;

  background: #f8f9fa;

  border-bottom-right-radius: 0.25em;
  border-bottom-left-radius: 0.25em;

  button {
    background-color: initial;
    border: 1px solid transparent;
    padding: 0.45em 1em;
    color: ${props => props.theme.colors.primary};
    width: auto;
    height: auto;
    border-radius: 6px;
    margin: 0;

    &:hover {
      background-color: initial;
    }

    & + button {
      background-color: ${props => props.theme.colors.primary};
      color: #fff;

      &:hover {
        background-color: ${props => props.theme.colors.primary};
        color: #fff;
        text-decoration: none;
      }
    }
  }
`;

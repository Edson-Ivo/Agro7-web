import React from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0 auto;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    flex: 0;
    flex-direction: row;
  }
`;

const Content = styled.div`
  display: flex;
  min-height: 100vh;

  ${props =>
    props.navOpen &&
    css`
      @media screen and (max-width: ${props.theme.breakpoints.mobile}px) {
        height: 0;
        overflow: hidden;
      }
    `};

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    display: block;
    width: 100%;
  }
`;

export const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

  .CenterContainer__content {
    background-color: ${props => props.theme.colors.background};
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    padding: 40px 20px;
    justify-content: center;
    padding-bottom: 30px;
    text-align: center;
    box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.05);
    width: 40%;
    max-width: ${props => props.theme.margins.center_width};

    .logoContainer {
      margin-top: 16px;
      margin-bottom: 32px;
    }

    .loginIcon {
      margin-right: 10px;
    }

    .loginButton {
      margin: 10px 0 20px;
    }

    @media (max-width: ${props => props.theme.breakpoints.tablet}px) {
      width: 50%;
    }

    @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
      box-shadow: none;
      height: 100vh;
      padding: 20px 50px;
      width: 100%;
    }
  }
`;

const Container = ({ children }) => {
  const navOpen = useSelector(state => state.nav.open);

  return (
    <Wrapper>
      <Content navOpen={navOpen}>{children}</Content>
    </Wrapper>
  );
};

export default Container;

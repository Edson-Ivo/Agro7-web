import React from 'react';

import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faHome, faBook } from '@fortawesome/free-solid-svg-icons';

import Button from '../Button';

const NavContainer = styled.div`
  background: ${props => props.theme.colors.background_nav};
  position: sticky;
  border-right: 2px solid ${props => props.theme.colors.border};
  min-height: 100vh;
  width: 350px;
  overflow-y: auto;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    background: none;
    flex-direction: row;
    bottom: 24px;
    position: fixed;
    border-right: 0;
    width: 100%;
    min-height: unset;
    overflow: hidden;
  }
`;

const NavContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: 360px;
  text-align: center;
  margin-top: 100px;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    border-radius: 10px;
    flex-direction: row;
    min-height: 0;
    margin: 0 85px 4px 85px;
    max-width: 100%;
    background: ${props => props.theme.colors.background_nav};
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    & img {
      display: none !important;
    }
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    margin: 0 40px 4px 40px;
  }
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 80%;
  margin: 24px auto;

  .navlist_button {
    font-size: 1em;
    margin: 7px auto;
    text-align: left;
    font-weight: 700;
    opacity: 0.8;

    .navlist_button__icon {
      font-size: 1.2em;
      align-items: flex-start;
      margin: 0 25px;
    }

    &.active,
    &:hover {
      opacity: 1;
      background: ${props => props.theme.colors.gray};
    }

    &:hover {
      color: ${props => props.theme.colors.black};
    }
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    margin: 0;
    flex-direction: row;
    min-height: 0;
    width: 100%;

    .navlist_button {
      background: none;
      box-shadow: none;
      border-radius: 0;
      color: ${props => props.theme.colors.black};
      margin: 0 auto;
      opacity: 0.5;
      text-align: center;
      padding-top: 3px;
      height: 70px;

      .navlist_button__description {
        display: block;
        margin-top: 5px;
        font-size: 0.9em;
        font-weight: 700;
      }

      .navlist_button__icon {
        margin: 0 auto;
        font-size: 1.65em;
      }
    }

    .navlist_button.active {
      background: none !important;
      border-top: 3px solid ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.black}!important;
      opacity: 1;
      padding-top: 0;
    }

    .navlist_button:hover {
      opacity: 1;
    }
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    .navlist_button__description {
      display: none !important;
    }
  }
`;

const Nav = () => (
  <NavContainer>
    <NavContent>
      <Image
        src="/logo/logo.png"
        width="200"
        height="80"
        className="nav-logo"
      />
      <NavList>
        <Link href="/">
          <Button className="navlist_button">
            <FontAwesomeIcon icon={faHome} className="navlist_button__icon" />
            <span className="navlist_button__description">Página Inicial</span>
          </Button>
        </Link>
        <Button className="navlist_button active">
          <FontAwesomeIcon icon={faBook} className="navlist_button__icon" />
          <span className="navlist_button__description">
            Caderno do Produtor
          </span>
        </Button>
        <Button className="navlist_button">
          <FontAwesomeIcon icon={faBook} className="navlist_button__icon" />
          <span className="navlist_button__description">Outro Elemento</span>
        </Button>
        <Button className="navlist_button">
          <FontAwesomeIcon icon={faBook} className="navlist_button__icon" />
          <span className="navlist_button__description">Outro Elemento</span>
        </Button>
      </NavList>
    </NavContent>
  </NavContainer>
);
export default Nav;

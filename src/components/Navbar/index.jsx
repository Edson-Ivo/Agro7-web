import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faCog,
  faSignOutAlt,
  faChevronUp,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

import UserImage from '../../assets/user.png';

const NavbarContainer = styled.div`
  display: flex;
  position: relative;
  padding: 0 85px;
  align-items: center;
  height: 100px;
  width: 100%;
  justify-content: flex-end;
  display: fixed;
  z-index: 3;

  & .navbar_button {
    font-size: 1em;
    line-height: 1em;
    padding: 0px 30px;
    height: 60px;
    display: flex;
    align-items: center;
    background: ${props => props.theme.colors.gray};
    border-radius: 10px;
    cursor: pointer;
    transition: 0.3s;
    user-select: none;

    h5 {
      pointer-events: none;
      font-weight: 800;
    }

    .navbar_button__image {
      border-radius: 999px;
      margin-right: 10px;
      vertical-align: -0.6em;
      width: 2em;
    }

    .navbar_button__icon {
      margin-left: 5px;
    }

    &.select {
      position: relative;
      z-index: 3;

      .navbar_button__select-options {
        visibility: hidden;
        opacity: 0;
        position: absolute;
        width: 100%;
        list-style-type: none;
        font-size: 1em;
        line-height: 1em;
        padding: 20px 0px;
        align-items: center;
        background: ${props => props.theme.colors.gray};
        border-radius: 10px;
        font-family: 'Montserrat';
        font-weight: 700;
        cursor: pointer;
        transition: 0.3s;
        top: 70px;
        right: 0;
        transform: translateY(-20px);
        z-index: 2;
        color: ${props => props.theme.colors.black_75};

        & > li {
          display: block;
          padding: 10px 0;
          width: 100%;
          transition: all 0.3s;

          span {
            padding-left: 30px;

            .navbar_button__select-options__icon {
              font-size: 1.25em;
              margin-right: 5px;
            }
          }
        }

        & > li:hover {
          background: #23424e1e;
          color: ${props => props.theme.colors.black};
        }

        &.opened {
          visibility: visible;
          opacity: 1;
          transform: translateY(0px);
        }
      }
    }
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    padding: 0 40px;
    border-bottom: 2px solid ${props => props.theme.colors.border};
    height: 80px;

    .navbar_button {
      background: none;
    }

    .navbar_button__image {
      width: 2.25em !important;
    }

    .navbar_button__select-options {
      width: 200px !important;
    }

    .navbar_button__text {
      display: none;
    }
  }
`;

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <NavbarContainer>
        <div className="navbar_button select" onClick={() => handleClick()}>
          <h5>
            <img
              className="navbar_button__image"
              src={UserImage}
              alt="Imagem do Usuário"
            />
            <span className="navbar_button__text">Guilherme Girão Alves </span>
            <FontAwesomeIcon
              icon={!open ? faChevronDown : faChevronUp}
              className="navbar_button__icon"
            />
          </h5>
          <ul
            className={`navbar_button__select-options ${open ? 'opened' : ''}`}
          >
            <li>
              <span>
                <FontAwesomeIcon
                  icon={faCog}
                  className="navbar_button__select-options__icon"
                />{' '}
                Configurações
              </span>
            </li>
            <li>
              <span>
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className="navbar_button__select-options__icon"
                />{' '}
                Sair
              </span>
            </li>
          </ul>
        </div>
      </NavbarContainer>
    </>
  );
};

export default Navbar;

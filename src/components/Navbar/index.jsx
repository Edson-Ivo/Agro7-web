import React, { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faCog,
  faSignOutAlt,
  faChevronUp,
  faChevronDown,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

import { NavToogleAction } from '@/store/modules/Nav/actions';
import { UserDeAuthAction } from '@/store/modules/User/actions';
import AuthService from '@/services/AuthService';
import { NavbarContainer } from './styles';

import Tooltip from '../Tooltip';

const Navbar = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const navOpen = useSelector(state => state.nav.open);
  const { name } = useSelector(state => state.user);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    dispatch(UserDeAuthAction());
    AuthService.logout();

    Router.push('/login');
  };

  return (
    <>
      <NavbarContainer open={open}>
        <div className="navbar__content">
          <div className="navbar__content__logo">
            <FontAwesomeIcon
              icon={!navOpen ? faBars : faTimes}
              onClick={() => dispatch(NavToogleAction())}
              className="navbar_toggle__icon"
            />
            <Link href="/">
              <a>
                <Image
                  src="/logo/logo.png"
                  width="100"
                  height="40"
                  alt="Logotipo Agro7"
                />
              </a>
            </Link>
          </div>
          <div className="navbar__content__right">
            <div
              className="navbar_button select"
              onClick={() => handleClick()}
              onKeyPress={() => handleClick()}
              role="button"
              tabIndex="0"
            >
              <div className="navbar_button__image">
                <Image
                  src="/assets/user-placeholder.png"
                  width={24}
                  height={24}
                  alt="Imagem de Usuário"
                />
              </div>
              <h5>
                <span className="navbar_button__text">
                  {name.replace(/ .*/, '')}
                </span>
                <FontAwesomeIcon
                  icon={!open ? faChevronDown : faChevronUp}
                  className="navbar_button__icon"
                />
              </h5>
              <Tooltip opened={open} clickAction={handleClick}>
                <ul>
                  <Link href="/configuracoes">
                    <li>
                      <span style={{ width: '100%' }}>
                        <FontAwesomeIcon icon={faCog} className="icon" /> Meus
                        Dados
                      </span>
                    </li>
                  </Link>
                  <li onClick={() => handleLogout()}>
                    <span>
                      <FontAwesomeIcon icon={faSignOutAlt} className="icon" />{' '}
                      Sair
                    </span>
                  </li>
                </ul>
              </Tooltip>
            </div>
          </div>
        </div>
      </NavbarContainer>
    </>
  );
};

export default Navbar;

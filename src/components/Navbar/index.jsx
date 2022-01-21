import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
  faTimes,
  faUser
} from '@fortawesome/free-solid-svg-icons';

import { NavToggleAction } from '@/store/modules/Nav/actions';
import AuthService from '@/services/AuthService';
import { NavbarContainer } from './styles';

import Tooltip from '../Tooltip';

const Navbar = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const navOpen = useSelector(state => state.nav.open);
  const {
    name,
    profile: { image_url: imageUrl }
  } = useSelector(state => state.user);

  const [userImage, setUseImage] = useState(`/assets/user-placeholder.png`);

  useEffect(() => {
    setUseImage(imageUrl);
  }, []);

  const handleClick = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleLogout = () => {
    AuthService.logout();

    router.reload();
  };

  return (
    <>
      <NavbarContainer open={open}>
        <div className="navbar__content">
          <div className="navbar__content__logo">
            <FontAwesomeIcon
              icon={!navOpen ? faBars : faTimes}
              onClick={() => dispatch(NavToggleAction())}
              onKeyPress={() => dispatch(NavToggleAction())}
              role="button"
              tabIndex="0"
              className="navbar_toggle__icon"
            />
            <Link href="/">
              <a>
                <Image
                  src="/logo/logo.png"
                  width="100"
                  height="40"
                  loading="eager"
                  alt="Logotipo Agro7"
                  priority
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
                  src={userImage}
                  width={48}
                  height={48}
                  loading="eager"
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
              <Tooltip opened={open} onClickOutside={() => setOpen(false)}>
                <ul>
                  <Link href="/configuracoes/perfil">
                    <li>
                      <span style={{ width: '100%' }}>
                        <FontAwesomeIcon icon={faUser} className="icon" /> Meu
                        Perfil
                      </span>
                    </li>
                  </Link>
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

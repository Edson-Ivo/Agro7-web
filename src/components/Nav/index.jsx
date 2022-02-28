import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCog,
  faHome,
  faBook,
  faMapMarkerAlt,
  faDolly,
  faUserSecret,
  faDollarSign,
  faChartPie
} from '@fortawesome/free-solid-svg-icons';

import usersTypes from '@/helpers/usersTypes';
import { useRouter } from 'next/router';

import { NavChangeAction } from '@/store/modules/Nav/actions';
import Button from '../Button';

const NavContainer = styled.div`
  background: ${props => props.theme.colors.background_nav};
  position: fixed;
  border-right: 2px solid ${props => props.theme.colors.border};
  min-height: 100vh;
  width: 250px;
  overflow-y: auto;
  left: 0;
  padding: 0 8px;
  padding-top: 24px;
  margin-top: 70px;
  z-index: 99999;
  transition: transform 0.1s ease-in-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
  }

  &.open {
    transform: translateX(0%) !important;
    height: 100%;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    border: 0;
    margin-top: 60px;
    padding-left: 24px;
    padding-right: 24px;
    transform: translateX(-100%);
    width: 100%;
  }
`;

const NavContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  text-align: center;
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 80px;

  .navlist_button {
    border: 0;
    height: 50px;
    font-size: 1em;
    text-align: left;
    font-weight: 700;
    opacity: 0.8;
    margin: 0 !important;
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: ${props => props.theme.colors.black};

    .navlist_button__icon {
      font-size: 1.2em;
      align-items: flex-start;
      margin-right: 17px;
      width: 20px;
    }

    &.active,
    &:hover {
      opacity: 1;
      background: ${props => props.theme.colors.gray};
    }

    &.active {
      color: ${props => props.theme.colors.green};
    }

    @media screen and (max-width: ${({ theme }) =>
        theme.breakpoints.mobile}px) {
      font-size: 1.1em;
      height: 60px;

      .navlist_button__icon {
        font-size: 1.3em;
      }
    }
  }
`;

const NavButton = ({ link, icon, text }) => {
  const { asPath } = useRouter();
  const dispatch = useDispatch();

  let path = '';
  let linked = '';

  if (asPath !== '/') [path] = asPath.split('/')?.[1].split('?');
  if (link !== '/') [, linked] = link.split('/');

  const active = path === linked ? 'active' : '';

  const handleClick = () => {
    dispatch(NavChangeAction(false));
  };

  return (
    <Link href={link}>
      <Button
        type="button"
        className={`navlist_button ${active}`}
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={icon} className="navlist_button__icon" />
        <span className="navlist_button__description">{text}</span>
      </Button>
    </Link>
  );
};

const Nav = () => {
  const navOpen = useSelector(state => state.nav.open);
  const { type } = useSelector(state => state.user);

  return (
    <NavContainer className={navOpen ? 'open' : ''}>
      <NavContent>
        <NavList>
          <NavButton link="/" icon={faHome} text="Página Inicial" />
          {usersTypes[3] !== type && (
            <>
              <NavButton
                link="/painel-controle"
                icon={faChartPie}
                text="Painel de Controle"
              />
              <NavButton
                link="/propriedades"
                icon={faMapMarkerAlt}
                text="Suas Propriedades"
              />
              <NavButton link="/insumos" icon={faDolly} text="Seus Insumos" />
              <NavButton
                link="/vendas"
                icon={faDollarSign}
                text="Suas Vendas"
              />
            </>
          )}

          <NavButton
            link="/caderno-produtor"
            icon={faBook}
            text="Caderno do Produtor"
          />

          {[usersTypes[3], usersTypes[4]].includes(type) && (
            <>
              <hr />
              <NavButton
                link="/tecnico"
                icon={faUserSecret}
                text="Painel Técnico"
              />
            </>
          )}
          {type === usersTypes[0] && (
            <>
              <hr />
              <NavButton
                link="/admin"
                icon={faUserCog}
                text="Painel Administrativo"
              />
            </>
          )}
        </NavList>
      </NavContent>
    </NavContainer>
  );
};

export default Nav;

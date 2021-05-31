import styled from 'styled-components';

export const NavbarContainer = styled.div`
  height: 70px;
  width: 100%;
  z-index: 3;
  padding: 0 24px;
  margin: 0 auto;
  position: fixed;
  background: ${props => props.theme.colors.background};
  border-bottom: 2px solid ${props => props.theme.colors.border};
  z-index: 9999;

  .navbar_toggle__icon {
    cursor: pointer;
    display: none;
    height: 20px;
    margin-right: 20px;
    width: 20px;

    @media screen and (max-width: ${props =>
        props.theme.breakpoints.mobile}px) {
      display: block;
    }
  }

  .navbar__content {
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;

    .navbar__content__logo {
      flex: 1 1;
      display: flex;
      align-items: center;
    }
  }

  & .navbar_button {
    font-size: 1em;
    line-height: 1em;
    padding: 0px 25px;
    height: 50px;
    display: flex;
    align-items: center;
    background: ${props =>
      !props.open ? props.theme.colors.gray : props.theme.colors.white};
    border: 1px solid ${props => props.theme.colors.gray};
    border-radius: 10px;
    cursor: pointer;
    transition: 0.3s;
    user-select: none;
    position: relative;
    flex-direction: row;

    h5 {
      pointer-events: none;
      font-weight: 800;
    }

    .navbar_button__image {
      border-radius: 999px;
      margin-right: 10px;
      vertical-align: -0.6em;
      width: 2em;

      img {
        width: 100%;
      }
    }

    .navbar_button__icon {
      margin-left: 5px;
    }
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    & .navbar_button:hover {
      background-color: ${props => props.theme.colors.white}!important;
      color: ${props => props.theme.colors.black}!important;
    }
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    height: 60px;

    .navbar_button {
      background: none !important;
      border: 0 !important;
      padding: 0px;
    }

    .navbar_button__image {
      width: 2em !important;
    }

    .navbar_button__text {
      display: none;
    }
  }
`;

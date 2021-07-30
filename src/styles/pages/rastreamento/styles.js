import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  flex-direction: column;
  position: relative;
  min-height: 100vh;
  width: 100%;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    font-size: 14px;
  }
`;

export const Header = styled.div`
  background: url('../assets/images/banner.jpg') no-repeat;
  background-size: cover;
  color: ${props => props.theme.colors.gray};
  min-height: 545px;
  padding-bottom: 35px;
  position: relative;
  width: 100%;

  & > div {
    justify-content: left;
    margin-top: 16px;
  }
`;

export const HeaderLogo = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 40px;
  text-align: center;
  width: 100%;

  .tracking-message {
    color: ${props => props.theme.colors.green};
    margin-top: 4px;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    margin-bottom: 32px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  max-width: 1440px;
  padding: 0 162px;
  word-wrap: break-word;
  width: 100%;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    padding: 0 24px;
  }
`;

export const ContentDivided = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-height: 240px;
  width: 100%;

  & > div {
    text-align: left;
    width: 100%;

    h2 {
      margin-bottom: 16px;
    }

    p {
      font-size: 1.25em;
    }

    &:first-child {
      align-self: flex-start;
    }

    &:last-child {
      padding-left: 64px;

      @media screen and (max-width: ${props =>
          props.theme.breakpoints.tablet}px) {
        margin-top: 16px;
        padding: 0;
      }
    }

    @media screen and (max-width: ${props =>
        props.theme.breakpoints.tablet}px) {
      text-align: center;
    }
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    display: block;
  }
`;

export const CardContainer = styled.div`
  color: ${props => props.theme.colors.gray}!important;
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  ${props =>
    props?.alternative &&
    css`
      color: ${props.theme.colors.black}!important;
    `};

  ${props =>
    props?.verticalAlign &&
    css`
      flex-direction: column;
      align-items: center;
    `}

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const CardImage = styled.div`
  background: ${props => props.theme.colors.gray};
  border-radius: 10px;
  max-width: 240px;
  max-height: 240px;
  overflow: hidden;

  ${props =>
    props?.verticalAlign &&
    css`
      margin-bottom: 16px;
    `}

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    margin-bottom: 32px;
  }
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 32px;
  width: calc(100% - 240px);
  text-align: left;

  .centered {
    padding: 0;
    text-align: center;
    width: 100%;
  }

  .card__body__description {
    font-size: 1.25em;
    margin-top: 4px;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    .card__body__description {
      margin: 14px 0 10px;
    }

    padding: 0;
    text-align: center;
    width: 100%;
  }
`;

export const CardContentButtons = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 2px;

  a {
    color: inherit;
    font-weight: inherit;
    text-decoration: none !important;
  }

  & > div {
    margin-top: 30px;

    @media screen and (max-width: ${props =>
        props.theme.breakpoints.tablet}px) {
      margin-top: 14px !important;
    }
  }

  & > div:not(:last-child) {
    margin-right: 24px;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    margin: 0 auto;
    width: auto;

    ${props =>
      props?.center &&
      css`
        justify-content: center;
        align-items: center;
      `};
  }
`;

export const HeaderMoreInfo = styled.div`
  position: absolute;
  bottom: 0;
  padding-bottom: 46px;
  left: 0;
  margin-top: 0;
  display: flex;
  align-items: center !important;
  justify-content: center !important;
  width: 100%;

  h5 {
    cursor: pointer;

    & > svg {
      margin-left: 8px;
    }
  }
`;

export const Section = styled.div`
  background: ${props => props.theme.colors.gray};
  margin: 0 auto;
  padding: 64px 0;
  width: 100%;

  h2 {
    text-transform: uppercase;
  }

  ${props =>
    props?.alternative &&
    css`
      background: inherit;

      h2 {
        color: ${props.theme.colors.green};
      }
    `};

  & > div {
    align-items: center;
    display: flex;
    justify-content: center;
    text-align: center;

    & > h2:not(:last-child),
    & > div:not(:last-child) {
      margin-bottom: 32px;
    }
  }
`;

export const SectionNutritionalTable = styled.div`
  position: relative;
  max-width: 540px;
  height: auto;
  width: 100%;

  img {
    border-radius: 10px;
    width: 100%;
  }
`;

export const GalleryImage = styled.div`
  padding: 1%;
  width: 85%;
  margin: 0 auto;

  img {
    border-radius: 10px;
    overflow: hidden;
  }
`;

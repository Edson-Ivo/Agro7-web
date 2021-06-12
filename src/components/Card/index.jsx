import styled, { css } from 'styled-components';

export const Card = styled.div`
  color: ${props =>
    props.isLight ? props.theme.colors.black : props.theme.colors.white};
  display: flex;
  cursor: pointer;
  flex-direction: row;
  width: 100%;
  min-height: ${props => props.height || '90px'};
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.color || props.theme.colors.white};
  box-shadow: 0px 6px 22px rgba(0, 0, 0, 0.05);
  border-radius: 10px;

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    min-height: ${props => props.height || '150px'};
  }

  ${props =>
    !props?.noPadding &&
    css`
      padding: 15px 0px 15px 25px;
    `};
  overflow: hidden;
  margin-top: 10px;
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

  .card-info {
    ${props =>
      props?.infoPadding &&
      css`
        padding: 15px 0px 15px 25px;
      `};
    width: 70%;

    h4 {
      margin-bottom: 10px;
    }

    p {
      word-break: break-word;
    }

    ${props =>
      props?.responsiveImage &&
      css`
        @media screen and (max-width: ${props.theme.breakpoints.mobile}px) {
          padding: 15px;
          width: 100%;
        }
      `};
  }

  .card-image {
    align-self: center;
    width: 30%;
    display: flex;
    justify-content: flex-end;
    position: relative;

    ${props =>
      !props?.noPadding &&
      css`
        padding-right: 24px;
      `};

    ${props =>
      props?.responsiveImage &&
      css`
        @media screen and (max-width: ${props.theme.breakpoints.mobile}px) {
          display: none;
        }
      `};

    .absolute_content {
      & svg {
        height: 100%;
      }
    }
  }

  .card-icon {
    font-size: 2.3em;
  }

  &:hover {
    filter: brightness(0.98);
    box-shadow: 0px 6px 13px rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: scale(0.985);
  }
`;

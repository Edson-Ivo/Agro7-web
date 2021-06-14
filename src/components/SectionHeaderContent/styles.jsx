import styled, { css } from 'styled-components';

export const StyledSectionHeaderContent = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 24px;
  margin: 0 auto;
  margin-bottom: 48px;
  max-width: ${props => props.theme.margins.content_width};
  width: 100%;

  .skeleton_description {
    display: block;
  }

  h2 {
    width: 100%;
  }

  h5.skeleton_container {
    width: 100%;
  }

  p {
    text-align: left;
    margin-top: 10px;
  }

  button {
    max-width: 200px;
    margin: 0;
    margin-top: 10px;
    align-self: flex-end;
  }

  .buttons__container {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    width: 100%;

    @media screen and (max-width: ${props =>
        props.theme.breakpoints.mobile}px) {
      flex-direction: column;
      margin-top: 16px;
    }

    button {
      &:nth-child(even) {
        margin-top: 0;
        margin-left: 8px;
        margin-right: 8px;
      }
    }
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    text-align: center;
    align-items: center;

    button {
      margin: 0 auto !important;
      max-width: 100% !important;
      margin-top: 16px !important;
    }

    h5.skeleton_container {
      max-width: 50%;
    }

    .react-loading-skeleton {
      max-width: 85% !important;
      width: 85% !important;
    }

    ${props =>
      props.isLoading &&
      css`
        p {
          text-align: center;
          width: 100%;
        }
      `};

    .skeleton_description {
      display: inline-block;
    }
  }
`;

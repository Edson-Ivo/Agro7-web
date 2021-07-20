import styled, { css } from 'styled-components';

export const StyledCardContentButton = styled.div`
  align-items: center;
  display: flex;
  font-size: 16px;
  flex-direction: row;
  min-height: 40px;

  ${props =>
    props?.cursor &&
    css`
      cursor: ${props.cursor};
    `};

  & > div:not(:last-child) {
    margin-right: 12px;
  }
`;

export const StyledCardContentButtonImage = styled.div`
  align-items: center;
  background: ${props => props.theme.colors.gray};
  border-radius: 10px;
  color: ${props => props.theme.colors.black_50};
  display: flex;
  justify-content: center;
  height: 40px;
  width: 40px;

  svg {
    height: 25px !important;
    width: 25px !important;
  }

  img {
    height: 28px !important;
    width: 28px !important;
  }
`;

export const StyledCardContentButtonText = styled.div`
  align-items: start;
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 144px;

  p {
    margin-top: 4px;
  }

  h6,
  p {
    font-size: 0.75em;
  }
`;

export const StyledCardContentButtonArrow = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;

  svg {
    height: 16px;
  }
`;

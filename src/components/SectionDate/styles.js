import styled from 'styled-components';

export const StyledSectionDate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 96px;
  width: 100%;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    padding: 0;
  }
`;

export const StyledSectionDateRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 40px 24px;
  margin-bottom: 40px;

  & > div {
    margin: 0 !important;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    display: block;
  }
`;

export const StyleSectionDateRowInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  & > div {
    margin: 0 !important;
  }
`;

export const StyledSectionDateRowTitle = styled.h2`
  text-align: right;
  padding-right: 24px;
  border-right: 8px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.green};
  margin: 0 !important;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    border: 0;
    padding: 0;
    margin-bottom: 8px !important;
    text-align: center;
  }
`;

export const StyledSectionDateRowIcon = styled.div`
  padding-right: 24px;

  svg {
    min-height: 25px;
    width: 25px !important;

    @media screen and (max-width: ${props =>
        props.theme.breakpoints.tablet}px) {
      min-height: 20px;
      width: 20px !important;
    }
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    padding-right: 8px;
  }
`;

export const StyledSectionDateRowDescription = styled.h4`
  display: flex;
  align-items: center;
  justify-content: center;
`;

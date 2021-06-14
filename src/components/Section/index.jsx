import styled from 'styled-components';

export const Section = styled.div`
  flex-grow: 1;
  align-content: center;
  padding-left: 250px;
  padding-top: 70px;

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    padding-left: 0px !important;
  }
`;

export const SectionHeader = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-top: 48px;
`;

export const SectionBody = styled.div`
  background: ${props => props.theme.colors.background_nav};
  padding: 24px 0;

  .SectionBody__content {
    margin: 0 auto;
    padding: 0 24px;
    max-width: ${props => props.theme.margins.content_width};
    width: 100%;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    &,
    .SectionBody__content {
      padding: 0px;
    }
  }
`;

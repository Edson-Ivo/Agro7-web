import styled from 'styled-components';

export const Section = styled.div`
  flex-grow: 1;
  align-content: center;
`;

export const SectionHeader = styled.div`
  margin-bottom: 24px;
`;

export const SectionBody = styled.div`
  margin: 10px 85px;

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    margin: 20px 40px;
    margin-bottom: 140px;
  }
`;

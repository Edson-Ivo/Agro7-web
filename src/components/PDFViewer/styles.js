import styled from 'styled-components';

const IFrame = styled.iframe`
  border: 0;
  border-radius: 10px;
  min-height: ${props => (props.mobileView ? 340 : 540)}px;
  overflow: hidden;
  width: 100%;
`;

export default IFrame;

import styled from 'styled-components';

const Loader = styled.div`
  border: 6px solid rgba(0, 0, 0, 0.1);
  border-left-color: ${props => props.theme.colors.green};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default Loader;

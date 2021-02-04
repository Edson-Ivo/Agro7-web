import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.black};
    font-family: 'Lato', sans-serif, 'Segoe UI', Verdana, Arial; 
    font-size: 16px;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
  }

  button {
    cursor: pointer;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Montserrat', sans-serif, 'Segoe UI', Verdana, Arial; 
  }

  h1, h2, h3, h4 {
    font-weight: 700;
  }

  h5, h6 {
    font-weight: 800;
  }

  h1 {
    font-size: 2.5em;
    line-height: 2em;
  }

`;

import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
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

  a {
    color: ${props => props.theme.colors.green};
    font-weight: 700;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    font-family: Montserrat;
    font-weight: 700;
    font-size: 1em;
    line-height: 1.25em;
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

  h2 {
    font-size: 2em;
    line-height: 1.5em;
  }

  h3 {
    font-size: 1.6em;
    line-height: 1.5em;
  }

  h4 {
    font-size: 1.25em;
    line-height: 1.25em;
  }

  a, 
  h5 {
    font-size: 1em;
    line-height: 1em;
  }

  h6 {
    font-size: 0.75em;
    line-height: 1em;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}px) {
    body {
      font-size: 14px;
    }
  }

`;

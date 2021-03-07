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
    font-size: 14px;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: ${props => props.theme.colors.green};
    font-weight: 700;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
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

  p.text {
    font-size: calc(1.15em - 0.1px);
    line-height: 1.6em;
  }

  .form-group {
    display: flex;
    flex-direction: row;
    width: 100%;

    > div {
      width: 100%;
      
      &:not(:last-child) {
        margin-right: 10px;
      }
    }

    @media screen and (max-width: ${props =>
      props.theme.breakpoints.mobile}px) {
      flex-direction: column;

      > div {
        margin-right: 0!important;
      }
    } 
  }

  .dot-flashing {
    position: relative;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    margin: 0 auto;
    background-color: ${props => props.theme.colors.green};;
    color: ${props => props.theme.colors.green};;
    animation: dotFlashing 1s infinite linear alternate;
    animation-delay: .5s;
  }

  .dot-flashing::before, .dot-flashing::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
  }

  .dot-flashing::before {
    left: -15px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: ${props => props.theme.colors.green};;
    color: ${props => props.theme.colors.green};;
    animation: dotFlashing 1s infinite alternate;
    animation-delay: 0s;
  }

  .dot-flashing::after {
    left: 15px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: ${props => props.theme.colors.green};;
    color: ${props => props.theme.colors.green};;
    animation: dotFlashing 1s infinite alternate;
    animation-delay: 1s;
  }

  @keyframes dotFlashing {
    0% {
      background-color: ${props => props.theme.colors.green};;
    }
    50%,
    100% {
      background-color: #ebe6ff;
    }
  }


`;

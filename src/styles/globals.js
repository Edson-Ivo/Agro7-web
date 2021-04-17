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
    font-family: ${props => props.theme.fonts.latoFamily}; 
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
    font-family: ${props => props.theme.fonts.montserratFamily}; 
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

  hr {
    width: 90%;
    height: 1px;
    margin: 5px auto;
    background: ${props => props.theme.colors.border};
    border: 0;
  }

  p.text {
    font-size: calc(1.15em - 0.1px);
    line-height: 1.6em;
  }

  .form-group {
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;

    &.buttons {
      margin-top: 15px;
    }

    > div {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      
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

  .table-responsive {
    overflow-x: auto;
  }

  .step-title {
    text-align: center;
    margin: 25px 0;
  }

  input,
  textarea,
  button,
  select,
  div,
  a {
    -webkit-tap-highlight-color: transparent;
  }

  .color-picker .react-colorful {
    width: auto;
  }

  .color-picker .react-colorful__saturation-pointer,
  .color-picker .react-colorful__hue-pointer,
  .color-picker .react-colorful__alpha-pointer {
    width: 20px;
    height: 20px;
  }

  .color-picker .react-colorful__alpha, 
  .color-picker .react-colorful__hue {
    height: 20px;
  }
`;

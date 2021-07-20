import { createGlobalStyle } from 'styled-components';
import { ShowTransition } from './mixins';

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

    &:hover {
      text-decoration: underline;
    }
  }

  button {
    cursor: pointer;
    font-family: ${props => props.theme.fonts.montserratFamily};
    font-weight: 700;
    font-size: 1em;
    line-height: 1.25em;
  }

  h1, h2, h3, h4, h5, h6,strong {
    font-family: ${props => props.theme.fonts.montserratFamily}; 
  }

  h1, h2, h3, h4 {
    font-weight: 700;
  }

  h5, h6, strong {
    font-weight: 800;
  }

  h1 {
    font-size: 2.5em;
    line-height: 1.5em;
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
  h5,
  strong {
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

  input,
  textarea,
  button,
  select,
  div,
  a {
    -webkit-tap-highlight-color: transparent;
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

  .color-picker {
    .react-colorful {
      width: auto;
    }

    .react-colorful__saturation {
      border-radius: 10px 10px 0 0;
    }

    .react-colorful__last-control {
      border-radius: 0 0 8px 8px;
    }

    .react-colorful__saturation-pointer,
    .react-colorful__hue-pointer,
    .react-colorful__alpha-pointer {
      width: 20px;
      height: 20px;
    }

    .react-colorful__alpha, 
    .react-colorful__hue {
      height: 20px;
    }
  }

  .CalendarDay__selected, .CalendarDay__selected:active, .CalendarDay__selected:hover {
    background: ${props => props.theme.colors.green};
    border: 1px double ${props => props.theme.colors.green};
  }
  
  .CalendarMonthGrid {
    text-align: center;
  }

  .CalendarMonthGrid__horizontal {
    left: 0 !important;
    width: auto !important;
  }

  .DayPicker_portal__horizontal {
    background-color: rgba(0,0,0,.3);
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 0 !important;
    margin-top: 0 !important;
    top: 0;
    left: 0;
    height: 100%;
    width: 100% !important;
    z-index: 999999 !important;  
    animation: show 0.3s;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
      -webkit-animation: none;
    }

    ${ShowTransition}
  }

`;

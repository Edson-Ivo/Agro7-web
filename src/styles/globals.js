import { createGlobalStyle } from 'styled-components';
import { ShowTransition } from './mixins';

export default createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    outline: 0;
    padding: 0;
  }

  a, button, input, [role="button"] {
    &:focus {
      box-shadow: 0 0 0 2px ${props => props.theme.colors.primary_65};
    }
  }

  .select__control:focus-within {
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary_65};
  }

  .select__input > input:focus {
    box-shadow: none !important;
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

  h1, h2, h3, h4, h5, h6, strong {
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

    button {
      width: 100%;
    }

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

  .CalendarDay__highlighted_calendar {
    background: ${props => props.theme.colors.green_highlight};

    &:hover {
      background: ${props => props.theme.colors.green_75};
      color: ${props => props.theme.colors.white};
    }
  }

  .CalendarDay__selected,
  .CalendarDay__selected:active,
  .CalendarDay__selected:hover {
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
      animation: none !important;
    }

    ${ShowTransition}
  }

  .grecaptcha-badge {
    display: none;
    opacity: 0;
    visibility: hidden;
  }

  .uppy-Dashboard-inner {
    background-color: ${({ theme }) => theme.colors.gray};
    border: 1px solid ${({ theme }) => theme.colors.gray};
    border-radius: 10px;
    color: ${({ theme }) => theme.colors.black};
    font-family: ${({ theme }) => theme.fonts.latoFamily};
  }

  .uppy-Dashboard-dropFilesHereHint {
    background-image: url("data:image/svg+xml;charset=utf-8,<svg width='48' height='48' xmlns='http://www.w3.org/2000/svg'><path d='M24 1v1C11.85 2 2 11.85 2 24s9.85 22 22 22 22-9.85 22-22S36.15 2 24 2V1zm0 0V0c13.254 0 24 10.746 24 24S37.254 48 24 48 0 37.254 0 24 10.746 0 24 0v1zm7.707 19.293a.999.999 0 1 1-1.414 1.414L25 16.414V34a1 1 0 1 1-2 0V16.414l-5.293 5.293a.999.999 0 1 1-1.414-1.414l7-7a.999.999 0 0 1 1.414 0l7 7z' fill='%2327AB8F'/></svg>");
    border: 1px dashed ${({ theme }) => theme.colors.green};
    color: inherit;
  }

  [data-uppy-drag-drop-supported=true] .uppy-Dashboard-AddFiles {
    border: 1px dashed ${({ theme }) => theme.colors.black_25};
  }

  .uppy-Dashboard-AddFiles-title {
    color: ${({ theme }) => theme.colors.black};
  }

  .uppy-Dashboard-browse,
  .uppy-DashboardContent-back,
  .uppy-DashboardContent-save,
  .uppy-DashboardContent-addMore {
    color: ${({ theme }) => theme.colors.blue};
  }

  .uppy-Dashboard-Item-action--remove {
    color: ${({ theme }) => theme.colors.red};
  }

  .uppy-Webcam-button {
    background-color: ${({ theme }) => theme.colors.red};
  }

  .uppy-Dashboard-Item-action--remove:hover {
    color: #d31b2d;
  }

  .cropper-line {
    background-color: ${({ theme }) => theme.colors.green};

    &:before {
      background-color: ${({ theme }) => theme.colors.green};
    }
  }
`;

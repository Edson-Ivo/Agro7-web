import styled, { css } from 'styled-components';

export const InputContainer = styled.div`
  position: relative;
`;

export const StyledInput = styled.input`
  background-color: ${props => props.theme.colors.gray};
  color: ${props => props.theme.colors.black};
  font-family: ${props => props.theme.fonts.latoFamily};
  font-size: 1em;
  height: ${props => (props.type !== 'checkbox' ? `50px;` : '')};
  line-height: 50px;
  padding: 0 20px;
  ${props => (props.type !== 'checkbox' ? `width: 100%;` : '')};
  ${props => (props.type !== 'checkbox' ? `margin: 5px 0px 15px` : '')};
  border-radius: 10px;
  transition: background 0.3s;

  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
  }

  ${props =>
    props.type === 'checkbox' &&
    css`
      margin-left: 3px;
      margin-top: 3px;
    `}

  ${props =>
    props.error
      ? css`
          border: 1px solid ${props.theme.colors.red};
        `
      : css`
          border: 1px solid ${props.theme.colors.gray};

          &:hover,
          &:focus {
            border: 1px solid ${props.theme.colors.border};
          }
        `}

  &:hover,
  &:focus {
    background-color: ${props => props.theme.colors.white};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }

  &[type='date']:disabled,
  &[type='time']:disabled {
    -webkit-appearance: none;

    &::-webkit-inner-spin-button,
    &::-webkit-calendar-picker-indicator {
      display: none;
      -webkit-appearance: none;
    }
  }
`;

export const Label = styled.label`
  align-self: left;
  color: ${props => props.theme.colors.black_50};
  cursor: text;
  display: flex;
  font-size: 1em;
  font-weight: 800;
  text-align: left;
  transition: ease 0.2s;
  margin-left: 10px;

  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
  }

  &.label_error {
    color: ${props => props.theme.colors.red};
  }
`;

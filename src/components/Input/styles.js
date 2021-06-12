import styled, { css } from 'styled-components';

import { ShrinkedLabel } from '@/styles/mixins';

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
  padding: ${props =>
    !['date', 'time'].includes(props.type) ? `16px 20px 0` : '0 20px'};
  ${props => (props.type !== 'checkbox' ? `display: block;` : '')};
  ${props => (props.type !== 'checkbox' ? `width: 100%;` : '')};
  ${props => (props.type !== 'checkbox' ? `margin: 5px 0px 15px` : '')};
  border-radius: 10px;
  transition: background 0.3s;
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

  ${props =>
    !['checkbox', 'date', 'time'].includes(props.type) &&
    css`
      &:focus + .input-label {
        ${ShrinkedLabel}
      }
    `}

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }

  &[type='date']::-webkit-calendar-picker-indicator {
    background: transparent;
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
    outline: 0 !important;
    border: none !important;
  }
`;

export const Label = styled.label`
  color: ${props => props.theme.colors.black_50};
  cursor: text;
  font-size: 1em;
  font-weight: 800;
  text-align: left;
  transition: ease 0.2s;
  position: absolute;
  left: 20px;
  top: 45%;
  transform: translateY(-40%);
  pointer-events: none;

  &.label_active {
    ${ShrinkedLabel}
  }

  &.label_error {
    color: ${props => props.theme.colors.red};
  }
`;

export const UpperLabel = styled.label`
  color: ${props => props.theme.colors.black_50};
  cursor: text;
  font-size: 1em;
  font-weight: 800;
  text-align: left;
  transition: ease 0.2s;
  margin-left: 10px;
`;

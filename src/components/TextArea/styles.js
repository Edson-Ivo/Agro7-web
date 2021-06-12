import styled, { css } from 'styled-components';

import { ShrinkedLabel } from '@/styles/mixins';

export const InputContainer = styled.div`
  position: relative;
`;

export const StyledTextArea = styled.textarea`
  background-color: ${props => props.theme.colors.gray};
  color: ${props => props.theme.colors.black};
  font: 400 1em 'Lato';
  height: 160px;
  line-height: 1.4em;
  padding: 24px 20px 0;
  display: block;
  width: 100%;
  border-radius: 10px;
  margin: 5px 0px 15px;
  transition: background 0.3s;
  resize: none;

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

  &:focus + .input-label {
    ${ShrinkedLabel}
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
  top: 11%;
  transform: translateY(-40%);
  pointer-events: none;

  &.label_active {
    ${ShrinkedLabel}
  }

  &.label_error {
    color: ${props => props.theme.colors.red};
  }
`;

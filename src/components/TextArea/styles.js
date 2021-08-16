import styled, { css } from 'styled-components';

export const InputContainer = styled.div`
  position: relative;
`;

export const StyledTextArea = styled.textarea`
  background-color: ${props => props.theme.colors.gray};
  color: ${props => props.theme.colors.black};
  font: 400 1em 'Lato';
  height: 160px;
  line-height: 1.4em;
  padding: 10px 20px;
  display: block;
  width: 100%;
  border-radius: 10px;
  margin: 5px 0px 15px;
  transition: background 0.3s;
  resize: none;

  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
  }

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
`;

export const Label = styled.label`
  color: ${props => props.theme.colors.black_50};
  cursor: text;
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

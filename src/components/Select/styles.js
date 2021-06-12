import styled, { css } from 'styled-components';

export const InputContainer = styled.div`
  position: relative;
  margin-top: 5px;

  .select__control {
    background-color: ${props => props.theme.colors.gray};
    color: ${props => props.theme.colors.black};
    font-size: 1em;
    height: 50px;
    padding: 0 10px;
    width: 100%;
    border-radius: 10px;
    margin: 5px 0px 15px;
    transition: background 0.3s;

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
      background-color: ${props => props.theme.colors.white}!important;
    }
  }

  .select__menu {
    z-index: 999;
    margin-bottom: 60px;
  }

  & .select__value-container {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.inputBackground};
    border-radius: 10px;
    padding: 8px;
    width: 100%;
    display: flex;
    align-items: center;

    &::placeholder {
      color: ${props => props.theme.colors.inputPlaceholder};
    }

    .select__single-value {
      color: ${props => props.theme.colors.primary}!important;
    }
  }
`;

export const StyledInput = styled.input``;

export const Label = styled.label`
  color: ${props => props.theme.colors.black_50};
  cursor: text;
  font-size: 1em;
  font-weight: 800;
  text-align: left;
  transition: ease 0.2s;
  margin-left: 10px;

  &.label_error {
    color: ${props => props.theme.colors.red};
  }
`;

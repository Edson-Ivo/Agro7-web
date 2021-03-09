import styled from 'styled-components';

import { ShrinkedLabel } from '@/components/Input/mixins';

export const InputContainer = styled.div`
  position: relative;
  margin-top: 5px;

  .select__control {
    background-color: ${props => props.theme.colors.gray};
    border: 1px solid ${props => props.theme.colors.gray};
    color: ${props => props.theme.colors.black};
    font-size: 1em;
    height: 50px;
    padding: 0 10px;
    ${props => (props.type !== 'checkbox' ? `width: 100%;` : '')};
    border-radius: 10px;
    ${props => (props.type !== 'checkbox' ? `margin: 5px 0px 15px` : '')};
    transition: background 0.3s;

    &:hover,
    &:focus {
      background-color: ${props => props.theme.colors.white};
      border: 1px solid ${props => props.theme.colors.border};
    }

    &:focus + .input-label {
      ${ShrinkedLabel}
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
`;

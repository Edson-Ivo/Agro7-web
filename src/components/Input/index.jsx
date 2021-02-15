import React, { useState } from 'react';
import styled from 'styled-components';

import { ShrinkedLabel } from './mixins';
import { masks } from './masks';

const InputContainer = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  background-color: ${props => props.theme.colors.gray};
  border: 1px solid ${props => props.theme.colors.gray};
  color: ${props => props.theme.colors.black};
  font-size: 1em;
  height: 55px;
  line-height: 55px;
  padding: 16px 20px 0;
  ${props => (props.type !== 'checkbox' ? `display: block;` : '')};
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
`;

const Label = styled.label`
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
`;

const Input = ({ handleChange, label, name, mask, ...otherProps }) => {
  const [value, setValue] = useState('');
  const [hasText, setHasText] = useState(!!value);

  const maskInput = e => {
    if (mask === 'cpf') setValue(masks.cpf(e.target.value));
    if (mask === 'cnpj') setValue(masks.cnpj(e.target.value));
    if (mask === 'cpf_cnpj') setValue(masks.cpf_cnpj(e.target.value));
  };

  const changeAction = e => {
    if (typeof mask === 'undefined') setValue(e.target.value);
    else maskInput(e);

    if (e.target.value !== '') setHasText(true);
    else setHasText(false);

    if (typeof handleChange !== 'undefined') handleChange(e);
  };

  return (
    <InputContainer>
      <StyledInput
        onChange={e => changeAction(e)}
        name={name}
        value={value}
        {...otherProps}
      />
      {label && (
        <Label className={`input-label ${hasText ? 'label_active' : ''}`}>
          {label}
        </Label>
      )}
    </InputContainer>
  );
};

export default Input;

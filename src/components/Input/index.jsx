import React, { useState } from 'react';
import { masks } from './masks';

import { InputContainer, StyledInput, Label } from './styles';

const Input = ({
  handleChange,
  label,
  name,
  mask,
  disabled,
  initialValue = '',
  ...otherProps
}) => {
  const [value, setValue] = useState(initialValue);
  const [hasText, setHasText] = useState(!!value);

  const maskInput = e => {
    if (mask === 'cpf') setValue(masks.cpf(e.target.value));
    if (mask === 'cnpj') setValue(masks.cnpj(e.target.value));
    if (mask === 'cpf_cnpj') setValue(masks.cpf_cnpj(e.target.value));
    if (mask === 'phone') setValue(masks.phone(e.target.value));
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
        disabled={disabled}
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

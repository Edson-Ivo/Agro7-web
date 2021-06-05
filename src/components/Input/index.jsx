import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { masks } from './masks';

import { InputContainer, StyledInput, Label, UpperLabel } from './styles';

const Input = (
  {
    handleChange,
    label,
    name,
    mask,
    disabled,
    initialValue = '',
    type = '',
    ...otherProps
  },
  ref
) => {
  const [value, setValue] = useState(initialValue);
  const [hasText, setHasText] = useState(!!value);

  useImperativeHandle(ref, () => ({
    value,
    setValue: v => {
      if (v !== '') {
        setHasText(true);
      }
      setValue(v);
    }
  }));

  const maskInput = e => {
    if (mask === 'cpf') {
      setValue(masks.cpf(e.target.value));
      e.target.value = masks.cpf(e.target.value);
    }
    if (mask === 'cnpj') {
      setValue(masks.cnpj(e.target.value));
      e.target.value = masks.cnpj(e.target.value);
    }
    if (mask === 'cpf_cnpj') {
      setValue(masks.cpf_cnpj(e.target.value));
      e.target.value = masks.cpf_cnpj(e.target.value);
    }
    if (mask === 'phone') {
      setValue(masks.phone(e.target.value));
      e.target.value = masks.phone(e.target.value);
    }
    if (mask === 'cep') {
      setValue(masks.cep(e.target.value));
      e.target.value = masks.cep(e.target.value);
    }
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
      {label && type === 'date' && (
        <UpperLabel className="input-label">{label}</UpperLabel>
      )}
      <StyledInput
        onChange={e => changeAction(e)}
        name={name}
        value={value}
        disabled={disabled}
        type={type}
        ref={ref}
        {...otherProps}
      />
      {label && type !== 'date' && (
        <Label className={`input-label ${hasText ? 'label_active' : ''}`}>
          {label}
        </Label>
      )}
    </InputContainer>
  );
};

export default forwardRef(Input);

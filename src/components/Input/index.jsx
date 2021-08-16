import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { masks } from './masks';
import { InputContainer, StyledInput, Label } from './styles';

const Input = ({
  handleChange,
  label,
  name,
  mask,
  disabled,
  step = 'any',
  type = '',
  ...otherProps
}) => {
  const inputRef = useRef(null);

  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: refs => refs.current.value,
      setValue: (refs, value) => {
        refs.current.value = value;
      },
      clearValue: refs => {
        refs.current.value = '';
      }
    });
  }, [fieldName, registerField]);

  const maskInput = v => masks?.[mask]?.(v) || '';

  const changeAction = e => {
    const { value: inputValue } = e.target;

    if (typeof mask !== 'undefined') {
      const maskedValue = maskInput(inputValue);

      inputRef.current.value = maskInput(maskedValue);
    }

    if (typeof handleChange !== 'undefined') handleChange(e);
  };

  return (
    <InputContainer>
      {label && (
        <Label
          className={`input-label ${error ? ' label_error' : ''}`}
          htmlFor={fieldName}
        >
          {label}
        </Label>
      )}
      <StyledInput
        id={fieldName}
        name={name}
        ref={inputRef}
        onChange={changeAction}
        type={type}
        defaultValue={defaultValue}
        error={!!error}
        disabled={disabled}
        placeholder={label || ''}
        step={type === 'number' ? step : null}
        {...otherProps}
      />
    </InputContainer>
  );
};

export default Input;

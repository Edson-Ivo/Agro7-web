import React, { useState, useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { masks } from './masks';
import { InputContainer, StyledInput, Label, UpperLabel } from './styles';

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
  const [hasText, setHasText] = useState(!!defaultValue || !!otherProps?.value);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: refs => refs.current.value,
      setValue: (refs, value) => {
        refs.current.value = value;
        setHasText(!!value);
      },
      clearValue: refs => {
        refs.current.value = '';
        setHasText(false);
      }
    });
  }, [fieldName, registerField]);

  const maskInput = v => masks?.[mask]?.(v) || '';

  const changeAction = e => {
    const { value: inputValue } = e.target;

    if (typeof mask !== 'undefined') {
      const maskedValue = maskInput(inputValue);

      inputRef.current.value = maskInput(maskedValue);
      setHasText(!!maskedValue);
    } else {
      setHasText(!!inputValue);
    }

    if (typeof handleChange !== 'undefined') handleChange(e);
  };

  return (
    <InputContainer>
      {label && ['date', 'time'].includes(type) && (
        <UpperLabel className={`input-label ${error ? 'label_error' : ''}`}>
          {label}
        </UpperLabel>
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
        step={type === 'number' ? step : null}
        {...otherProps}
      />
      {label && !['date', 'time'].includes(type) && (
        <Label
          className={`input-label ${hasText ? 'label_active' : ''}${
            error ? 'label_error' : ''
          }`}
        >
          {label}
        </Label>
      )}
    </InputContainer>
  );
};

export default Input;

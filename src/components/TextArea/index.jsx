import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { InputContainer, StyledTextArea, Label } from './styles';

const TextArea = ({ handleChange, label, name, disabled, ...otherProps }) => {
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

  const changeAction = e => {
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
      <StyledTextArea
        onChange={changeAction}
        name={name}
        disabled={disabled}
        ref={inputRef}
        defaultValue={defaultValue}
        id={fieldName}
        error={!!error}
        {...otherProps}
      />
    </InputContainer>
  );
};

export default TextArea;

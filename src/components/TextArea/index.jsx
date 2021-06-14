import React, { useState, useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { InputContainer, StyledTextArea, Label } from './styles';

const TextArea = ({ handleChange, label, name, disabled, ...otherProps }) => {
  const inputRef = useRef(null);

  const { fieldName, defaultValue, registerField, error } = useField(name);
  const [hasText, setHasText] = useState(!!defaultValue);

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

  const changeAction = e => {
    const { value: inputValue } = e.target;

    setHasText(!!inputValue);

    if (typeof handleChange !== 'undefined') handleChange(e);
  };

  return (
    <InputContainer>
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
      {label && (
        <Label
          className={`input-label ${hasText ? 'label_active' : ''}
                    ${error ? ' label_error' : ''}`}
        >
          {label}
        </Label>
      )}
    </InputContainer>
  );
};

export default TextArea;

import React, { useEffect, useRef } from 'react';

import { useField } from '@unform/core';

import { InputContainer, StyledInput, Label } from '@/components/Input/styles';

const Checkbox = ({
  name,
  handleChange,
  value,
  label,
  disabled,
  ...otherProps
}) => {
  const inputRef = useRef();
  const { fieldName, defaultValue, registerField, error } = useField(name);

  const defaultChecked = defaultValue === value;

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: ref => ref.current.checked,
      clearValue: ref => {
        ref.current.checked = defaultChecked;
      },
      setValue: (ref, v) => {
        ref.current.checked = v;
      }
    });
  }, [defaultValue, fieldName, registerField, defaultChecked]);

  const changeAction = e => {
    const { checked } = e.target;

    if (typeof handleChange !== 'undefined') handleChange({ name, checked });
  };

  return (
    <InputContainer checkboxContainer>
      <StyledInput
        defaultChecked={defaultChecked}
        ref={inputRef}
        name={fieldName}
        value={value}
        type="checkbox"
        id={fieldName}
        error={!!error}
        disabled={disabled}
        onChange={changeAction}
        {...otherProps}
      />
      <Label
        className={`input-label ${error ? ' label_error' : ''}`}
        htmlFor={fieldName}
        key={fieldName}
      >
        {label}
      </Label>
    </InputContainer>
  );
};

export default Checkbox;

import React, { useState, forwardRef, useImperativeHandle } from 'react';

import { InputContainer, StyledTextArea, Label } from './styles';

const Input = (
  { handleChange, label, name, disabled, initialValue = '', ...otherProps },
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

  const changeAction = e => {
    setValue(e.target.value);

    if (e.target.value !== '') setHasText(true);
    else setHasText(false);

    if (typeof handleChange !== 'undefined') handleChange(e);
  };

  return (
    <InputContainer>
      <StyledTextArea
        onChange={e => changeAction(e)}
        name={name}
        value={value}
        disabled={disabled}
        {...otherProps}
        ref={ref}
      />
      {label && (
        <Label className={`input-label ${hasText ? 'label_active' : ''}`}>
          {label}
        </Label>
      )}
    </InputContainer>
  );
};

export default forwardRef(Input);

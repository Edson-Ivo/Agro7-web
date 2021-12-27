import React, { useRef, useEffect } from 'react';
import ReactSelect from 'react-select';
import { useField } from '@unform/core';

import { InputContainer, Label } from './styles';

const Select = ({
  name,
  options,
  label,
  disabled,
  searchable = false,
  clearable = false,
  onChange = () => null,
  noLabel = false,
  ...rest
}) => {
  const selectRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue: ref => {
        if (rest.isMulti) {
          if (!ref.state.value) return [];

          return ref.state.value.map(option => option.value);
        }

        if (!ref.state?.value) return '';

        return ref.state.value.value;
      },
      setValue: (ref, value) => {
        ref.select.setValue(value || null);
      },
      clearValue: ref => {
        ref.select.clearValue();
      }
    });
  }, [fieldName, registerField, rest.isMulti]);

  const handleChange = e => {
    onChange(e);
  };

  return (
    <InputContainer error={error}>
      {label && !noLabel && (
        <Label
          className={`input-label ${error ? ' label_error' : ''}`}
          htmlFor={fieldName}
        >
          {label}
        </Label>
      )}
      <ReactSelect
        name={name}
        inputId={fieldName}
        options={options}
        classNamePrefix="select"
        placeholder={label}
        defaultValue={
          defaultValue && options.find(option => option.value === defaultValue)
        }
        ref={selectRef}
        onChange={e => handleChange(e)}
        components={
          disabled
            ? {
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null
              }
            : null
        }
        isDisabled={disabled}
        noOptionsMessage={() => 'Não há dados'}
        isSearchable={searchable}
        isClearable={clearable}
        theme={theme => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary25: '#C5C3C6',
            primary: '#23424E',
            primary75: '#23424E',
            primary50: '#23424E',
            neutral0: '#fff'
          }
        })}
        {...rest}
      />
    </InputContainer>
  );
};

export default Select;

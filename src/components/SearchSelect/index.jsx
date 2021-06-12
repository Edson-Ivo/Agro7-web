import React, { useEffect, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useField } from '@unform/core';

import { InputContainer, Label } from '@/components/Select/styles';
import { api } from '@/services/api';

const SearchSelect = ({
  name,
  options = [],
  label,
  disabled,
  url,
  onChange = null,
  searchField = 'name',
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
          if (!ref.select.state.value) return [];

          return ref.select.state.value.map(option => option.value);
        }

        if (!ref.select.state.value) return '';

        return ref.select.state.value.value;
      },
      setValue: (ref, val) => {
        ref.select.setValue(val || null);
      }
    });
  }, [fieldName, registerField, rest.isMulti]);

  const handleChange = e => {
    if (onChange !== null) onChange(e);
  };

  const loadOptions = async (inputText, callback) => {
    const json = await api.get(`${url}?limit=20&${searchField}=${inputText}`);

    if (json?.data)
      callback(json.data.items.map(i => ({ label: i.name, value: i.id })));
  };

  return (
    <InputContainer error={error}>
      {label && (
        <Label className={`input-label ${error ? 'label_error' : ''}`}>
          {label}
        </Label>
      )}
      <AsyncSelect
        cacheOptions
        name={name}
        defaultOptions={options}
        loadOptions={loadOptions}
        classNamePrefix="select"
        placeholder={label}
        defaultValue={
          defaultValue && options.find(option => option.value === defaultValue)
        }
        ref={selectRef}
        onChange={e => handleChange(e)}
        noOptionsMessage={() => 'Não há dados relacionados a sua pesquisa'}
        loadingMessage={() => 'Buscando...'}
        isDisabled={disabled}
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

export default SearchSelect;

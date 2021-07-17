import React, { useEffect, useMemo, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useField } from '@unform/core';

import { InputContainer, Label } from '@/components/Select/styles';
import { api } from '@/services/api';
import isEmpty from '@/helpers/isEmpty';

const SearchSelect = ({
  name,
  options = [],
  label,
  disabled,
  url,
  urlQuery = null,
  onChange = null,
  searchField = 'name',
  limit = 20,
  ...rest
}) => {
  const selectRef = useRef(null);
  const [noMessage, setNoMessage] = useState(
    options !== true
      ? 'Insira 1 ou mais caracteres para pesquisar'
      : 'Não encontramos esse registro'
  );

  const getQuery = () => {
    let temp = '';

    if (urlQuery) {
      Object.keys(urlQuery).forEach(q => {
        temp += `&${q}=${urlQuery[q]}`;
      });
    }

    return temp;
  };

  const query = useMemo(() => getQuery(), [urlQuery]);

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

        if (!ref.select?.state?.value) return '';

        return ref.select.state.value.value;
      },
      setValue: (ref, val) => {
        ref.select.setValue(val || null);
      },
      clearValue: ref => {
        ref.select?.select.clearValue();
      }
    });
  }, [fieldName, registerField, rest.isMulti]);

  const handleChange = e => {
    if (onChange !== null) onChange(e);

    if (!isEmpty(e)) setNoMessage('Não há dados relacionados a sua pesquisa');
    else
      setNoMessage(
        options !== true
          ? 'Insira 1 ou mais caracteres para pesquisar'
          : 'Não encontramos esse registro'
      );
  };

  const loadOptions = (inputText, callback) => {
    setTimeout(async () => {
      const q = `${query}&${searchField}=${inputText}`;
      const json = await api.get(`${url}?limit=${limit}${q}`);

      if (json?.data)
        callback(json.data.items.map(i => ({ label: i.name, value: i.id })));
    }, 100);
  };

  return (
    <InputContainer error={error}>
      {label && (
        <Label className={`input-label ${error ? ' label_error' : ''}`}>
          {label}
        </Label>
      )}
      <AsyncSelect
        key={JSON.stringify(urlQuery)}
        cacheOptions
        name={name}
        defaultOptions
        loadOptions={loadOptions}
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
        noOptionsMessage={() => noMessage}
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

import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';

import { InputContainer, Label } from '@/components/Select/styles';
import { api } from '@/services/api';

const SearchSelect = ({ name, options, label, value, disabled, ...rest }) => {
  const [valueChange, setValueChange] = useState(value);

  const handleChange = e => {
    setValueChange(e.value);
  };

  const loadOptions = async (inputText, callback) => {
    const json = await api.get(`/users/find/all?limit=20&name=${inputText}`);

    if (json?.data)
      callback(json.data.items.map(i => ({ label: i.name, value: i.id })));
  };

  return (
    <InputContainer>
      {label && <Label className="input-label">{label}</Label>}
      <AsyncSelect
        defaultOptions
        loadOptions={loadOptions}
        classNamePrefix="select"
        cacheOptions
        placeholder={label}
        // defaultValue={options.filter(option => option.value === value)}
        onChange={e => handleChange(e)}
        noOptionsMessage={() => 'Não há dados'}
        isDisabled={disabled}
        {...rest}
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
      />
      <input type="hidden" tabIndex={-1} name={name} value={valueChange} />
    </InputContainer>
  );
};

export default SearchSelect;

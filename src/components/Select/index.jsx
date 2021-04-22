import React, { useState } from 'react';
import ReactSelect from 'react-select';

import { InputContainer, Label } from './styles';

const Select = ({
  name,
  options,
  label,
  value,
  disabled,
  searchable = false,
  clearable = false,
  onChange = null,
  noLabel = false,
  ...rest
}) => {
  const [valueChange, setValueChange] = useState(value);

  const handleChange = e => {
    setValueChange(e?.value || '');

    if (onChange !== null) onChange(e);
  };

  return (
    <InputContainer>
      {label && !noLabel && <Label className="input-label">{label}</Label>}
      <ReactSelect
        options={options}
        classNamePrefix="select"
        placeholder={label}
        value={options.filter(option => option.value === valueChange) || null}
        onChange={e => handleChange(e)}
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
      <input type="hidden" tabIndex={-1} name={name} value={valueChange} />
    </InputContainer>
  );
};

export default Select;

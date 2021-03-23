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
  ...rest
}) => {
  const [valueChange, setValueChange] = useState(value);

  const handleChange = e => {
    setValueChange(e.value);
  };

  return (
    <InputContainer>
      {label && <Label className="input-label">{label}</Label>}
      <ReactSelect
        options={options}
        classNamePrefix="select"
        placeholder={label}
        defaultValue={options.filter(option => option.value === value)}
        onChange={e => handleChange(e)}
        isDisabled={disabled}
        noOptionsMessage={() => 'Não há dados'}
        isSearchable={searchable}
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

export default Select;

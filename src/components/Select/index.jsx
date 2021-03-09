import React from 'react';
import ReactSelect from 'react-select';

import { InputContainer, Label } from './styles';

const Select = ({ options, label, value, ...rest }) => (
  <InputContainer>
    {label && <Label className={`input-label'}`}>{label}</Label>}
    <ReactSelect
      defaultValue={value}
      options={options}
      classNamePrefix="select"
      placeholder={label}
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
  </InputContainer>
);

export default Select;

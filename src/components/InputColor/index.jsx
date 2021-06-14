import React, { useState } from 'react';
import Input from '@/components/Input';
import { HexColorPicker } from 'react-colorful';

const InputColor = ({ initialValue = '#000', name, hidden = false }) => {
  const [color, setColor] = useState(initialValue);

  const handleChange = e => {
    setColor(`#${e.target.value.replaceAll('#', '')}`);
  };

  return (
    <>
      <div className="color-picker">
        <HexColorPicker color={color} onChange={setColor} />
      </div>
      {!hidden ? (
        <Input
          label="Selecione a cor"
          value={color}
          type="text"
          name={name}
          handleChange={handleChange}
          maxLength="7"
        />
      ) : (
        <input type="hidden" tabIndex={-1} name={name} value={color} />
      )}
    </>
  );
};

export default InputColor;

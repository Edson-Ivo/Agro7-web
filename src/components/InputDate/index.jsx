import 'react-dates/initialize';
import React, { useEffect, useState } from 'react';
import Input from '@/components/Input';
import moment from 'moment';
import { SingleDatePicker, DayPickerSingleDateController } from 'react-dates';

import 'react-dates/lib/css/_datepicker.css';

const InputDate = ({ initialValue, onChange, id, name, label, ...rest }) => {
  const [startDate, setStartDate] = useState(initialValue || moment());
  const [isFocused, setFocused] = useState(false);

  const handleChange = date => {
    setStartDate(date);

    if (onChange !== 'undefined') onChange(date);
  };

  return (
    <>
      <SingleDatePicker
        id={id}
        date={startDate}
        focused={isFocused}
        displayFormat="DD/MM/YYYY"
        onDateChange={handleChange}
        onFocusChange={({ focused }) => setFocused(focused)}
        isOutsideRange={() => false}
        numberOfMonths={1}
        withPortal={true}
        hideKeyboardShortcutsPanel
        showInput
      />
    </>
  );
};

export default InputDate;

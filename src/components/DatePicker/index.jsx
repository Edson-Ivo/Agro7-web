import 'react-dates/initialize';
import React, { useEffect, useState } from 'react';
import { DayPickerSingleDateController } from 'react-dates';
import { Portal } from 'react-portal';
import { useMediaQuery } from 'react-responsive';

import moment from 'moment';
import 'moment/locale/pt-br';

import 'react-dates/lib/css/_datepicker.css';

const DatePicker = ({
  onChange,
  onOutsideClick,
  initialValue,
  hidden = true
}) => {
  const [startDate, setStartDate] = useState(moment());
  const useSingleCalendar = useMediaQuery({ minWidth: 612 });

  useEffect(() => {
    setStartDate(moment(initialValue));
  }, [initialValue]);

  const handleChange = date => {
    setStartDate(date);

    if (onChange !== null) onChange(date);
  };

  const handleOutSideClick = () => {
    if (onOutsideClick !== null) onOutsideClick();
  };

  return (
    <>
      {!hidden && (
        <Portal>
          <DayPickerSingleDateController
            date={startDate}
            initialVisibleMonth={() => startDate}
            onDateChange={handleChange}
            isOutsideRange={() => false}
            numberOfMonths={useSingleCalendar ? 2 : 1}
            onOutsideClick={() => handleOutSideClick()}
            transitionDuration={0}
            hideKeyboardShortcutsPanel
            focused
            withPortal
          />
        </Portal>
      )}
    </>
  );
};

export default DatePicker;

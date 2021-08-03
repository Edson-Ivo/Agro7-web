import 'react-dates/initialize';
import React, { useEffect, useState } from 'react';
import { DayPickerSingleDateController } from 'react-dates';
import { Portal } from 'react-portal';
import { useMediaQuery } from 'react-responsive';
import 'moment/locale/pt-br';

import 'react-dates/lib/css/_datepicker.css';
import { getCurrentDate } from '@/helpers/date';
import isSameDay from '@/helpers/isSameDay';

const DatePicker = ({
  onChange = () => null,
  onOutsideClick,
  initialValue,
  hidden = true,
  datesList = [],
  onMonthClick = () => null
}) => {
  const [startDate, setStartDate] = useState(getCurrentDate());
  const useSingleCalendar = useMediaQuery({ minWidth: 612 });

  useEffect(() => {
    setStartDate(getCurrentDate(initialValue));
  }, [initialValue]);

  const handleChange = date => {
    setStartDate(date);

    onChange(date);
  };

  const onMonthClickHandle = date => onMonthClick(date);

  const handleOutSideClick = () => {
    if (onOutsideClick !== null) onOutsideClick();
  };

  const dayHighlight = day1 =>
    datesList.some(day2 => isSameDay(day1, getCurrentDate(day2)));

  return (
    <>
      {!hidden && (
        <Portal>
          <DayPickerSingleDateController
            date={startDate}
            transitionDuration={0}
            numberOfMonths={useSingleCalendar ? 2 : 1}
            initialVisibleMonth={() => startDate}
            onDateChange={handleChange}
            onNextMonthClick={onMonthClickHandle}
            onPrevMonthClick={onMonthClickHandle}
            onOutsideClick={() => handleOutSideClick()}
            isDayHighlighted={dayHighlight}
            isOutsideRange={() => false}
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

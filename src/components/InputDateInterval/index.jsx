import React, { useState, useEffect, useRef, memo } from 'react';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Loader from '@/components/Loader';

import {
  dateToInput,
  getCurrentDate,
  getStartDate,
  getFinishDate,
  isValidDate
} from '@/helpers/date';
import isEmpty from '@/helpers/isEmpty';
import mountQuery from '@/helpers/mountQuery';

const selectOptions = [
  {
    value: 'one_week_ago',
    label: 'há 1 semana'
  },
  {
    value: 'one_month_ago',
    label: 'há 1 mês'
  },
  {
    value: 'three_months_ago',
    label: 'há 3 meses'
  },
  {
    value: 'six_months_ago',
    label: 'há 6 meses'
  },
  {
    value: 'one_year_ago',
    label: 'há 1 ano'
  },
  {
    value: 'two_years_ago',
    label: 'há 2 anos'
  },
  {
    value: 'custom',
    label: 'Personalizado'
  }
];

const InputDateInterval = ({
  url = '',
  toQuery = true,
  resetDateOption = false,
  onDateStartSelect = () => null,
  onDateEndSelect = () => null,
  onPeriodSelect = () => null,
  onError = () => null,
  ...rest
}) => {
  const formRef = useRef(null);
  const router = useRouter();
  const [error, setError] = useState('');
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [dateStartSearch, setDateStartSearch] = useState(null);
  const [dateEndSearch, setDateEndSearch] = useState(null);
  const [period, setPeriod] = useState('');
  const [loadingCustom, setLoadingCustom] = useState(false);

  const handleOnDateStartSelect = e => {
    handleOnDateSelect(e?.target?.value, setDateStart);
  };

  const handleOnDateEndSelect = e => {
    handleOnDateSelect(e?.target?.value, setDateEnd);
  };

  const handleOnDateSelect = (dateValue, setDateEvent) => {
    setDateEvent(dateValue);
  };

  const handleResetDates = () => {
    setError('');
    setDateStart(null);
    setDateEnd(null);
    setDateStartSearch(null);
    setDateEndSearch(null);
    setPeriod('undefined');

    formRef.current.reset();

    if (toQuery)
      router.push(
        mountQuery(router, url, {}, ['period', 'dateStart', 'dateEnd'])
      );
  };

  const handleChangeSetPeriod = e => {
    const val = e?.value;

    if (val) {
      setPeriod(val);
      if (toQuery)
        router.push(
          mountQuery(router, url, { period: val }, ['dateStart', 'dateEnd'])
        );

      if (val === 'custom') {
        setLoadingCustom(true);

        setTimeout(() => {
          setLoadingCustom(false);
        }, 500);
      }

      onPeriodSelect(val);
    }
  };

  const handleSubmitDates = () => {
    if (
      dateStart &&
      dateEnd &&
      isValidDate(dateStart) &&
      isValidDate(dateEnd)
    ) {
      setError('');
      setDateStartSearch(dateStart);
      setDateEndSearch(dateEnd);

      if (toQuery)
        router.push(mountQuery(router, url, { period, dateStart, dateEnd }));
    } else {
      setError('Selecione um período válido!');
    }
  };

  const isValidPeriod = p => {
    let isValid = false;

    selectOptions.forEach(({ value }) => {
      if (value === p) isValid = true;
    });

    return isValid;
  };

  useEffect(() => {
    const {
      period: queryPeriod,
      dateStart: queryDateStart,
      dateEnd: queryDateEnd
    } = router.query;

    if (!isEmpty(queryPeriod)) {
      const validQueryPeriod = isValidPeriod(queryPeriod);

      setPeriod(validQueryPeriod ? queryPeriod : 'undefined');
    } else {
      setPeriod('undefined');
    }

    if (queryDateStart && isValidDate(queryDateStart)) {
      setDateStart(dateToInput(queryDateStart));
      setDateStartSearch(dateToInput(queryDateStart));
    }

    if (queryDateEnd && isValidDate(queryDateEnd)) {
      setDateEnd(dateToInput(queryDateEnd));
      setDateEndSearch(dateToInput(queryDateEnd));
    } else {
      const today = getCurrentDate();

      setDateEnd(dateToInput(today));
      setDateEndSearch(dateToInput(today));
    }
  }, []);

  useEffect(() => {
    setError('');

    if (isValidPeriod(period)) {
      const today = getCurrentDate();
      const dateEndPeriod = getCurrentDate();

      let dateStartPeriod = '';

      if (period === 'one_week_ago') {
        dateStartPeriod = today.subtract(1, 'week').format('YYYY-MM-DD');
      } else if (period === 'one_month_ago') {
        dateStartPeriod = today
          .startOf('month')
          .subtract(1, 'months')
          .format('YYYY-MM-DD');
      } else if (period === 'three_months_ago') {
        dateStartPeriod = today
          .startOf('month')
          .subtract(3, 'months')
          .format('YYYY-MM-DD');
      } else if (period === 'six_months_ago') {
        dateStartPeriod = today
          .startOf('month')
          .subtract(6, 'months')
          .format('YYYY-MM-DD');
      } else if (period === 'one_year_ago') {
        dateStartPeriod = today
          .startOf('month')
          .subtract(1, 'years')
          .format('YYYY-MM-DD');
      } else if (period === 'two_years_ago') {
        dateStartPeriod = today
          .startOf('month')
          .subtract(2, 'years')
          .format('YYYY-MM-DD');
      }

      if (dateStartPeriod && dateEndPeriod) {
        setDateStartSearch(dateStartPeriod);
        setDateEndSearch(dateEndPeriod.format('YYYY-MM-DD'));
      }
    }
  }, [period]);

  useEffect(() => {
    if (dateStartSearch) onDateStartSelect(getStartDate(dateStartSearch));
  }, [dateStartSearch]);

  useEffect(() => {
    if (dateEndSearch) onDateEndSelect(getFinishDate(dateEndSearch));
  }, [dateEndSearch]);

  useEffect(() => {
    onError(error);
  }, [error]);

  return (
    <>
      {period && (
        <div {...rest}>
          <Form
            ref={formRef}
            initialData={{
              period,
              date_start: dateStart,
              date_end: dateEnd
            }}
          >
            <div className="form-group">
              <div>
                <Select
                  options={selectOptions}
                  label="Período de tempo"
                  name="period"
                  onChange={handleChangeSetPeriod}
                />
              </div>
            </div>
            {period === 'custom' && (
              <>
                {(!loadingCustom && (
                  <>
                    <div className="form-group">
                      <div>
                        <Input
                          type="date"
                          label="Data Inicial"
                          name="date_start"
                          handleChange={handleOnDateStartSelect}
                        />
                      </div>
                      <div>
                        <Input
                          type="date"
                          label="Data Final"
                          name="date_end"
                          handleChange={handleOnDateEndSelect}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <Button
                        type="button"
                        className="primary"
                        onClick={() => handleSubmitDates()}
                      >
                        Filtrar pelo período escolhido
                      </Button>
                    </div>
                  </>
                )) || <Loader />}
              </>
            )}
            {resetDateOption && (
              <Button type="button" onClick={() => handleResetDates()}>
                <FontAwesomeIcon icon={faTimes} /> Limpar Filtro
              </Button>
            )}
          </Form>
        </div>
      )}
    </>
  );
};

export default memo(InputDateInterval);

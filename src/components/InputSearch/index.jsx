import React, { useState, useEffect, useRef, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useRouter } from 'next/router';

import { Form } from '@unform/web';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

import Input from '@/components/Input';
import Button from '@/components/Button';

import mountQuery from '@/helpers/mountQuery';

import {
  InputSearchContainer,
  InputSearchFilter,
  InputSearchForm
} from './styles';
import InputDateInterval from '../InputDateInterval/index';
import Tooltip from '../Tooltip/index';
import Checkbox from '../Checkbox/index';

const InputSearch = ({
  url = '',
  label = 'Pesquisar',
  filters = {
    date: false,
    checkboxes: false
  },
  onSubmitSearch = () => null
}) => {
  const formRef = useRef(null);
  const formFilterRef = useRef(null);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState(false);
  const [filterValues, setFilterValues] = useState({});

  const isMobile = useMediaQuery({ maxWidth: 800 });

  const handleSubmit = ({ searchField }) => {
    onSubmitSearch(searchField);
    setFilterValues(prevFilterValues => ({
      ...prevFilterValues,
      q: searchField
    }));
  };

  const handleChangeCheckboxes = ({ name, checked }) => {
    setFilterValues(prevFilterValues => ({
      ...prevFilterValues,
      [name]: checked
    }));
  };

  const handleChangeDates = (val, key) =>
    setFilterValues(prevFilterValues => ({
      ...prevFilterValues,
      [key]: val
    }));

  const handleResetFilter = () => {
    const resetFilter = filterValues;

    setFilterValues({});
  };

  useEffect(() => {
    const { date, checkboxes } = filters;

    setFilter(!Object.keys(filters).every(key => !filters[key]));

    if (date) {
      setFilterValues({
        period: '',
        dateStart: '',
        dateEnd: ''
      });
    }

    if (checkboxes) {
      Object.entries(checkboxes).forEach(([key, { defaultValue }]) =>
        setFilterValues(prevFilterValues => ({
          ...prevFilterValues,
          [key]: defaultValue
        }))
      );
    }
  }, []);

  useEffect(() => {
    console.log(filterValues);
    router.push(mountQuery(router, url, { ...filterValues }, [], [], false));
  }, [filterValues]);

  return (
    <>
      <InputSearchContainer>
        {filter && (
          <InputSearchFilter>
            <Button type="button" onClick={() => setOpen(true)}>
              <FontAwesomeIcon icon={faFilter} /> {!isMobile ? 'Filtrar' : null}
            </Button>
            <Tooltip
              opened={open}
              onClickOutside={() => setOpen(false)}
              position="left"
              minWidth="400px"
              responsive
            >
              {filters?.date && (
                <InputDateInterval
                  toQuery={false}
                  onDateStartSelect={v => handleChangeDates(v, 'dateStart')}
                  onDateEndSelect={v => handleChangeDates(v, 'dateEnd')}
                  onPeriodSelect={v => handleChangeDates(v, 'period')}
                />
              )}
              {filters?.checkboxes && (
                <Form ref={formFilterRef} initialData={{ ...filterValues }}>
                  <ul>
                    {Object.entries(filters?.checkboxes).map(
                      ([key, { name, defaultValue }]) => (
                        <li key={key}>
                          <Checkbox
                            name={key}
                            label={name}
                            value={defaultValue}
                            handleChange={handleChangeCheckboxes}
                          />
                        </li>
                      )
                    )}
                  </ul>
                </Form>
              )}
              <hr />
              <Button type="button" onClick={() => handleResetFilter()}>
                <FontAwesomeIcon icon={faTimes} /> Limpar Filtros
              </Button>
            </Tooltip>
          </InputSearchFilter>
        )}
        <InputSearchForm>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <div>
              <Input type="search" name="searchField" placeholder={label} />
              <Button className="primary" type="submit" title="Pesquisar">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </div>
          </Form>
        </InputSearchForm>
      </InputSearchContainer>
    </>
  );
};

export default memo(InputSearch);

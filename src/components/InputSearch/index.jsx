import React, { useState, useEffect, useRef, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useRouter } from 'next/router';

import { Form } from '@unform/web';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

import Input from '@/components/Input';
import Button from '@/components/Button';

import mountQuery from '@/helpers/mountQuery';
import isEmpty from '@/helpers/isEmpty';
import renameKeys from '@/helpers/renameKeys';

import {
  InputSearchContainer,
  InputSearchFilter,
  InputSearchForm
} from './styles';
import InputDateInterval from '../InputDateInterval/index';
import Tooltip from '../Tooltip/index';
import Checkbox from '../Checkbox/index';
import Select from '../Select/index';

const InputSearch = ({
  url = '',
  label = 'Pesquisar',
  filters = {
    date: false,
    checkboxes: false,
    selects: false
  },
  searchable = true,
  onSubmitSearch = () => null,
  onFilterChange = () => null
}) => {
  const formRef = useRef(null);
  const formFilterRef = useRef(null);
  const dateFieldRef = useRef(null);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [initialFilter, setInitialFilter] = useState({});
  const [searchField, setSearchField] = useState('');

  const isMobile = useMediaQuery({ maxWidth: 800 });

  const handleSubmit = ({ searchField: searchFieldVal }) => {
    onSubmitSearch(searchFieldVal);

    router.replace(
      mountQuery(router, url, { q: searchFieldVal }, [], [], false)
    );
  };

  const handleChangeSearchField = e => {
    const { value } = e.target;

    setSearchField(value);

    if (isEmpty(value)) handleSubmit({ searchField: '' });
  };

  const handleChangeCheckboxes = ({ name, checked }) => {
    setFilterValues(prevFilterValues => ({
      ...prevFilterValues,
      [name]: Boolean(checked)
    }));
  };

  const handleChangeSelects = (key, val) => {
    setFilterValues(prevFilterValues => ({
      ...prevFilterValues,
      [key]: val?.value
    }));
  };

  const handleChangeDates = (key, val) => {
    setFilterValues(prevFilterValues => ({
      ...prevFilterValues,
      [key]: val
    }));
  };

  const handleChangePeriod = period => {
    setFilterValues(prevFilterValues => ({
      ...prevFilterValues,
      period
    }));
  };

  const handleResetFilter = () => {
    formFilterRef?.current?.setData({ ...initialFilter });
    if (filters?.date) dateFieldRef.current.clearFields();

    setFilterValues({ ...initialFilter });
  };

  useEffect(() => {
    const { checkboxes, date, selects } = filters;
    const { q = '', ...queryFilter } = router.query;
    let filterInitial = {};

    setFilter(!Object.keys(filters).every(key => !filters[key]));

    if (date) {
      filterInitial = {
        period: '',
        dateStart: '',
        dateEnd: ''
      };
    }

    if (checkboxes) {
      Object.entries(checkboxes).forEach(
        // eslint-disable-next-line no-return-assign
        ([key, { defaultValue }]) =>
          (filterInitial = {
            ...filterInitial,
            [key]: Boolean(defaultValue)
          })
      );
    }

    if (selects) {
      Object.entries(selects).forEach(
        // eslint-disable-next-line no-return-assign
        ([key, { defaultValue }]) =>
          (filterInitial = {
            ...filterInitial,
            [key]: defaultValue
          })
      );
    }

    setInitialFilter({ ...filterInitial });

    const filterDist = { ...filterInitial };

    Object.keys(filterDist).forEach(key => {
      filterDist[key] = queryFilter?.[key] || filterInitial[key];

      if (filterDist[key] === 'true' || filterDist[key] === 'false')
        filterDist[key] = String(filterDist[key]) === 'true';
    });

    setFilterValues({ ...filterDist });

    if (searchable) {
      setSearchField(q);

      if (!isEmpty(q)) onSubmitSearch(q);
    }
  }, []);

  useEffect(() => {
    router.replace(mountQuery(router, url, filterValues, [], [], false));

    if (onFilterChange && !isEmpty(filterValues)) {
      const filterAdjust = { ...filterValues };

      Object.keys(filterAdjust).forEach(key => {
        const val = String(filterAdjust[key]);

        if (val === 'true') filterAdjust[key] = '1';
        if (val === 'false') filterAdjust[key] = '0';
        if (val === 'all') filterAdjust[key] = '';
      });

      if (filterAdjust?.period) delete filterAdjust?.period;

      onFilterChange(
        renameKeys(
          { dateEnd: 'date_finish', dateStart: 'date_start' },
          filterAdjust
        )
      );
    }
  }, [filterValues]);

  return (
    <>
      <InputSearchContainer>
        {filter && (
          <InputSearchFilter searchable={searchable}>
            <Button type="button" onClick={() => setOpen(true)}>
              <FontAwesomeIcon icon={faFilter} />{' '}
              {!isMobile || !searchable ? 'Filtros' : null}
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
                  ref={dateFieldRef}
                  toQuery={false}
                  autoDateEnd={false}
                  onDateStartSelect={date =>
                    handleChangeDates('dateStart', date)
                  }
                  onDateEndSelect={date => handleChangeDates('dateEnd', date)}
                  onPeriodSelect={period => handleChangePeriod(period)}
                />
              )}

              <Form ref={formFilterRef} initialData={{ ...filterValues }}>
                <>
                  {filters?.checkboxes && (
                    <ul>
                      {Object.entries(filters?.checkboxes).map(
                        ([key, { name }]) => (
                          <li key={key}>
                            <Checkbox
                              name={key}
                              label={name}
                              handleChange={e => handleChangeCheckboxes(e)}
                            />
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </>
                <>
                  {filters?.selects && (
                    <div>
                      {Object.entries(filters?.selects).map(
                        ([key, { options = [], label: labelSelect }]) => (
                          <div key={key}>
                            <Select
                              name={key}
                              options={options}
                              label={labelSelect}
                              onChange={e => handleChangeSelects(key, e)}
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}
                </>
              </Form>

              <hr />
              <Button type="button" onClick={() => handleResetFilter()}>
                <FontAwesomeIcon icon={faTimes} /> Limpar Filtros
              </Button>
            </Tooltip>
          </InputSearchFilter>
        )}
        {searchable && (
          <InputSearchForm>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <div>
                <Input
                  type="search"
                  name="searchField"
                  onChange={e => handleChangeSearchField(e)}
                  placeholder={label}
                  value={searchField}
                  required
                />
                <Button className="primary" type="submit" title="Pesquisar">
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </div>
            </Form>
          </InputSearchForm>
        )}
      </InputSearchContainer>
    </>
  );
};

export default memo(InputSearch);

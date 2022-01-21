import React, { useEffect, useState } from 'react';
import InputSearch from '../InputSearch/index';

const ActionsSearch = ({
  url = '',
  typeAction,
  onSubmitSearch = () => {},
  onFilterChange = () => {}
}) => {
  const [searchable, setSearchable] = useState(true);
  const [filters, setFilters] = useState({
    date: true,
    time: false
  });

  useEffect(() => {
    if (
      typeAction === 'services' ||
      typeAction === 'applications-supplies' ||
      typeAction === 'durable-goods' ||
      typeAction === 'consumable-goods' ||
      typeAction === 'others'
    ) {
      setSearchable(true);
      setFilters({
        date: true,
        time: false
      });
    } else if (typeAction === 'supplies') {
      setSearchable(true);
      setFilters({
        date: false,
        time: false
      });
    } else if (typeAction === 'rains') {
      setSearchable(false);
      setFilters({
        date: true,
        time: false
      });
    } else if (typeAction === 'irrigations') {
      setSearchable(true);
      setFilters({
        date: true,
        time: true
      });
    }
  }, [typeAction]);

  return (
    <>
      <hr style={{ width: '100%' }} />
      <InputSearch
        url={url}
        filters={filters}
        searchable={searchable}
        onSubmitSearch={q => onSubmitSearch(q)}
        onFilterChange={f => onFilterChange({ ...f })}
      />
      <hr style={{ width: '100%' }} />
    </>
  );
};

export default ActionsSearch;

import React, { useState, useEffect, createRef, useRef } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Error from '@/components/Error';
import Loader from '@/components/Loader';
import Button from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { Card } from '@/components/Card';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import {
  DateWrapper,
  DateContainer,
  DateContent,
  DateCardWrapper,
  DateCard,
  DateCardCalendar
} from '@/components/DateContainer';

import {
  addOneDay,
  dateConversor,
  dateToInput,
  dateToISOString,
  dateToISOStringFinish,
  getActualTwoWeekInterval,
  getCurrentDate,
  getDateMonthInterval,
  isValidDate,
  weekDays
} from '@/helpers/date';
import { isLight } from '@/helpers/colors';
import { useFetch } from '@/hooks/useFetch';
import useOnScreen from '@/hooks/useOnScreen';
import { useInfiniteFetch } from '@/hooks/useInfiniteFetch';

import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import { truncateProducerNotebook } from '@/helpers/truncate';
import isEmpty, { isArrayOfEmpty } from '@/helpers/isEmpty';
import InputSearch from '@/components/InputSearch/index';
import objectToQuery from '@/helpers/objectToQuery';

function ProducerNotebook() {
  const daysRef = createRef();
  const router = useRouter();

  const ref = useRef();
  const formRef = useRef(null);
  const isVisible = useOnScreen(ref);
  const isMobile = useMediaQuery({ maxWidth: 800 });

  const pageSize = 10;
  const [activeDate, setActiveDate] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [daysList, setDaysList] = useState([]);
  const [hideCalendar, setHideCalendar] = useState(true);
  const [dateCalendarInterval, setDateCalendarInterval] = useState([
    null,
    null
  ]);
  const [dateWeekInterval, setDateWeekInterval] = useState([null, null]);
  const [userRecords, setUserRecords] = useState([]);
  const [userWeekRecords, setUserWeekRecords] = useState([]);
  const [monthSelected, setMonthSelected] = useState('');

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    is_log: '',
    categories: ''
  });
  const [dataCategoriesOptions, setDataCategoriesOptions] = useState([]);

  const { searchDate = null } = router.query;

  const { data, error, size, setSize, isValidating } = useInfiniteFetch(
    activeDate
      ? `/producer-notebook/find/by/user-logged?date_start=${activeDate}&date_finish=${dateToISOStringFinish(
          activeDate
        )}&search=${search}${
          objectToQuery(filters) ? `&${objectToQuery(filters)}` : ''
        }`
      : null,
    pageSize
  );

  const { data: dataCategories, error: errorCategories } = useFetch(
    `/categories/find/all?limit=30`
  );

  const { data: dataUserRecords, error: errorUserRecords } = useFetch(
    !isArrayOfEmpty(dateCalendarInterval)
      ? `/producer-notebook/find/count/by/user-logged?date_start=${
          dateCalendarInterval[0]
        }&date_finish=${dateCalendarInterval[1]}&search=${search}${
          objectToQuery(filters) ? `&${objectToQuery(filters)}` : ''
        }`
      : null
  );

  const { data: dataUserRecordsWeek, error: errorUserRecordsWeek } = useFetch(
    !isArrayOfEmpty(dateWeekInterval)
      ? `/producer-notebook/find/count/by/user-logged?date_start=${
          dateWeekInterval[0]
        }&date_finish=${dateWeekInterval[1]}&search=${search}${
          objectToQuery(filters) ? `&${objectToQuery(filters)}` : ''
        }`
      : null
  );

  const notes = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmptyData = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmptyData || (data && data[data.length - 1]?.length < pageSize);
  const isRefreshing = isValidating && data && data.length === size;

  useEffect(() => {
    const actualTwoWeekInterval = getActualTwoWeekInterval();

    setDateWeekInterval(actualTwoWeekInterval);
  }, []);

  useEffect(() => {
    if (isVisible && !isReachingEnd && !isRefreshing) setSize(size + 1);
  }, [isVisible, isRefreshing]);

  useEffect(() => handleDate(), [searchDate]);

  useEffect(() => {
    if (!isEmpty(activeDate)) {
      const interval = getDateMonthInterval(activeDate, 1);
      setDateCalendarInterval(interval);
    }
  }, [activeDate]);

  useEffect(() => {
    const query = dataUserRecords?.producer_notebook;
    const months = [];

    if (!isEmpty(query)) {
      Object.keys(query).forEach(key => {
        const { date } = query[key];

        months.push(String(dateToInput(addOneDay(date))));
      });
    }

    setUserRecords(months);
  }, [dataUserRecords]);

  useEffect(() => {
    if (monthSelected) {
      const interval = getDateMonthInterval(dateToInput(monthSelected), 1);
      setDateCalendarInterval(interval);
    }
  }, [monthSelected]);

  useEffect(() => {
    const query = dataUserRecordsWeek?.producer_notebook;
    const days = [];

    if (!isEmpty(query)) {
      Object.keys(query).forEach(key => {
        const { date } = query[key];

        days.push(String(dateToInput(addOneDay(date))));
      });
    }

    setUserWeekRecords(days);
  }, [dataUserRecordsWeek]);

  useEffect(() => {
    if (!isEmpty(dataCategories)) {
      const c = dataCategories?.items?.map(item => ({
        value: item?.id,
        label: item?.name
      }));

      setDataCategoriesOptions([{ value: 'all', label: 'Todas' }, ...c]);
    }
  }, [dataCategories]);

  const handleDate = () => {
    const actualWeek = weekDays();
    let actualDate = null;

    if (searchDate !== null && isValidDate(searchDate)) {
      actualDate = dateToISOString(`${searchDate} `);
    } else {
      const date = getCurrentDate().startOf('day');

      actualDate = dateToISOString(date);
    }

    setDaysList(actualWeek);
    setActiveDate(actualDate);
    setActiveCategory('');
    formRef?.current?.setFieldValue('types', '');
  };

  const handleChangeDate = date => {
    router.push(`/caderno-produtor?searchDate=${date}`);
    setHideCalendar(true);
  };

  if (errorCategories || error || errorUserRecords || errorUserRecordsWeek)
    return (
      <Error
        error={
          errorCategories || error || errorUserRecords || errorUserRecordsWeek
        }
      />
    );

  return (
    <>
      <Head>
        <title>Caderno do Produtor - Agro9</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title={`Caderno do Produtor - ${dateConversor(
                activeDate,
                false
              )}`}
              description="Aqui, você poderá visualizar suas ações realizadas no sistema pela data ou categorias."
              isLoading={isEmpty(activeDate)}
            >
              <Link href="/caderno-produtor/cadastrar">
                <Button className="primary">
                  <FontAwesomeIcon icon={faPlus} /> Anotar no Caderno
                </Button>
              </Link>
            </SectionHeaderContent>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {!isEmpty(activeDate) && (
                  <>
                    <DatePicker
                      hidden={hideCalendar}
                      initialValue={activeDate}
                      onChange={date =>
                        handleChangeDate(date.format('YYYY-MM-DD'))
                      }
                      onOutsideClick={() => setHideCalendar(true)}
                      datesList={userRecords}
                      onMonthClick={setMonthSelected}
                    />
                    <DateWrapper style={{ marginTop: -10 }}>
                      <DateContainer>
                        <DateContent>
                          <ScrollContainer
                            hideScrollbars={false}
                            className="scroll-container"
                          >
                            <DateCardCalendar
                              onClick={() => setHideCalendar(false)}
                            >
                              <div>
                                <Image
                                  src="/assets/calendar-search.png"
                                  width="30"
                                  height="30"
                                />
                              </div>
                            </DateCardCalendar>
                            {daysList.map(
                              ({ date, day, dateString, string }) => (
                                <DateCardWrapper key={dateString}>
                                  <DateCard
                                    onClick={() => handleChangeDate(dateString)}
                                    ref={activeDate === string ? daysRef : null}
                                    active={activeDate === string}
                                    highlight={userWeekRecords.some(
                                      d => d === dateString
                                    )}
                                  >
                                    <h3>{date}</h3>
                                    <span>{day}</span>
                                  </DateCard>
                                </DateCardWrapper>
                              )
                            )}
                          </ScrollContainer>
                        </DateContent>
                      </DateContainer>
                    </DateWrapper>
                  </>
                )}

                <div
                  style={{
                    borderBottom: '1px solid #EEEDEA',
                    marginTop: 14,
                    marginBottom: 14
                  }}
                >
                  <div style={{ marginBottom: 8, marginLeft: 10 }}>
                    <h4>
                      Anotações do dia {dateConversor(activeDate, false)}:
                    </h4>
                  </div>

                  {dataCategoriesOptions && (
                    <InputSearch
                      url="/caderno-produtor/"
                      filters={{
                        selects: {
                          is_log: {
                            options: [
                              {
                                value: 'all',
                                label: 'Todos'
                              },
                              {
                                value: '1',
                                label: 'Histórico'
                              },
                              {
                                value: '0',
                                label: 'Anotações'
                              }
                            ],
                            label: 'Listar somente',
                            defaultValue: 'all'
                          },
                          categories: {
                            options: dataCategoriesOptions,
                            label: 'Categoria',
                            defaultValue: 'all'
                          }
                        }
                      }}
                      onFilterChange={f => setFilters({ ...f })}
                      onSubmitSearch={q => setSearch(q)}
                    />
                  )}
                </div>
                {!isEmpty(activeDate) && data && (
                  <>
                    {(!isEmptyData &&
                      notes.map(d => (
                        <Card
                          key={d.id}
                          color={`#${d.categories.colors.hexadecimal}`}
                          isLight={isLight(d.categories.colors.hexadecimal)}
                          onClick={() =>
                            router.push(`/caderno-produtor/${d.id}/detalhes`)
                          }
                          height="140px"
                          maxHeight="350px"
                        >
                          <div className="card-info">
                            <h4>{d.name}</h4>
                            <p>
                              {truncateProducerNotebook(
                                d.description,
                                isMobile
                              )}
                            </p>
                          </div>
                        </Card>
                      ))) || (
                      <Alert style={{ marginTop: '10px' }}>
                        Não há registros no caderno para a data{' '}
                        {activeCategory && 'ou categoria '} selecionada
                      </Alert>
                    )}
                  </>
                )}
                <div ref={ref}>
                  {isLoadingMore && !isEmptyData ? <Loader /> : null}
                </div>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(ProducerNotebook);

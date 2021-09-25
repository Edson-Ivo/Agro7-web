import React, { useState, useEffect, createRef, useRef } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';
import { useMediaQuery } from 'react-responsive';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Error from '@/components/Error';
import Loader from '@/components/Loader';
import Select from '@/components/Select';
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

function UserProducerNotebook() {
  const daysRef = createRef();
  const router = useRouter();

  const ref = useRef(null);
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

  const { id, searchDate = null } = router.query;

  const { data, error, size, setSize, isValidating } = useInfiniteFetch(
    activeDate !== null
      ? `/producer-notebook/find/by/user/${id}?date_start=${activeDate}&date_finish=${dateToISOStringFinish(
          activeDate
        )}${activeCategory !== '' ? `&categories=${activeCategory}` : ''}`
      : null,
    pageSize
  );

  const { data: dataCategories, error: errorCategories } = useFetch(
    `/categories/find/all?limit=30`
  );

  const { data: dataUser, error: errorUser } = useFetch(
    `/users/find/by/id/${id}`
  );

  const { data: dataUserRecords, error: errorUserRecords } = useFetch(
    !isArrayOfEmpty(dateCalendarInterval)
      ? `/producer-notebook/find/count/by/user/${id}?date_start=${dateCalendarInterval[0]}&date_finish=${dateCalendarInterval[1]}`
      : null
  );

  const { data: dataUserRecordsWeek, error: errorUserRecordsWeek } = useFetch(
    !isArrayOfEmpty(dateWeekInterval)
      ? `/producer-notebook/find/count/by/user/${id}?date_start=${dateWeekInterval[0]}&date_finish=${dateWeekInterval[1]}`
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

  useEffect(() => {
    handleDate();
  }, [searchDate]);

  useEffect(() => {
    if (!isEmpty(activeDate)) {
      if (daysRef.current !== null)
        daysRef.current.scrollIntoView({ behavior: 'smooth' });

      const interval = getDateMonthInterval(activeDate, 1);
      setDateCalendarInterval(interval);
    }
  }, [activeDate]);

  useEffect(() => {
    const query = dataUserRecords?.producer_notebook;

    if (!isEmpty(query)) {
      const months = [];

      Object.keys(query).forEach(key => {
        const { date } = query[key];

        months.push(String(dateToInput(addOneDay(date))));
      });

      setUserRecords(months);
    }
  }, [dataUserRecords]);

  useEffect(() => {
    if (monthSelected) {
      const interval = getDateMonthInterval(dateToInput(monthSelected), 1);
      setDateCalendarInterval(interval);
    }
  }, [monthSelected]);

  useEffect(() => {
    const query = dataUserRecordsWeek?.producer_notebook;

    if (!isEmpty(query)) {
      const days = [];

      Object.keys(query).forEach(key => {
        const { date } = query[key];

        days.push(String(dateToInput(addOneDay(date))));
      });

      setUserWeekRecords(days);
    }
  }, [dataUserRecordsWeek]);

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
    router.push(`/admin/users/${id}/caderno-produtor?searchDate=${date}`);
    setHideCalendar(true);
  };

  const handleChangeCategory = e => setActiveCategory(e?.value || '');

  if (
    errorCategories ||
    error ||
    errorUser ||
    errorUserRecords ||
    errorUserRecordsWeek
  )
    return (
      <Error
        error={
          errorCategories ||
          error ||
          errorUser ||
          errorUserRecords ||
          errorUserRecordsWeek
        }
      />
    );

  return (
    <>
      <Head>
        <title>Painel Administrativo | Caderno do Produtor - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%usuario': dataUser?.name
              }}
              title={`Caderno do Produtor - ${dateConversor(
                activeDate,
                false
              )}`}
              description={`Aqui, você poderá visualizar as ações realizadas por ${dataUser?.name} no sistema
                pela data ou categorias.`}
              isLoading={isEmpty(dataUser) || isEmpty(activeDate)}
            >
              <Link href={`/admin/users/${id}/caderno-produtor/cadastrar`}>
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
                  {dataCategories && (
                    <div>
                      <Form
                        ref={formRef}
                        initialData={{ types: activeCategory }}
                      >
                        <Select
                          options={dataCategories?.items.map(category => ({
                            value: category.id,
                            label: category.name
                          }))}
                          label="Filtrar por categoria"
                          name="types"
                          clearable
                          noLabel
                          onChange={handleChangeCategory}
                        />
                      </Form>
                    </div>
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
                            router.push(
                              `/admin/users/${id}/caderno-produtor/${d.id}/detalhes`
                            )
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

export default privateRoute(['administrador'])(UserProducerNotebook);

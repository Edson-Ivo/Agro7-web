import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Select from '@/components/Select/index';
import Container from '../../components/Container';
import Nav from '../../components/Nav';
import Navbar from '../../components/Navbar';
import Breadcrumb from '../../components/Breadcrumb';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Section, SectionHeader, SectionBody } from '../../components/Section';
import { Card } from '../../components/Card';
import Error from '../../components/Error';
import { CardContainer } from '../../components/CardContainer';
import {
  DateWrapper,
  DateContainer,
  DateContent,
  DateCard
} from '../../styles/pages/CadernoProdutor';
import { privateRoute } from '../../components/PrivateRoute';
import Loader from '../../components/Loader';

import CardBack from '../../assets/card_back.svg';

import { weekDays } from '../../helpers/date';
import { useFetch } from '../../hooks/useFetch';

import CoordinatesService from '../../services/CoordinatesService';
import SearchSelect from '@/components/SearchSelect';

function ProducerNotebook() {
  const [activeDate, setActiveDate] = useState(0);
  const [daysList, setDaysList] = useState([]);

  const router = useRouter();
  const limit = router.query.limit || 1;

  const { data, error } = useFetch('/coordinates/find/all');

  useEffect(() => {
    setDaysList(weekDays);
  }, []);

  const handleClick = async () => {
    console.log('aaa');
  };

  if (error) return <Error />;

  return (
    <>
      <Head>
        <title>Caderno do Produtor - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              <Breadcrumb
                path={[
                  { route: '/', name: 'Home' },
                  { route: '/caderno-produtor', name: 'Caderno do Produtor' }
                ]}
              />
              <h2>Caderno do Produtor</h2>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              {(data && (
                <CardContainer>
                  <DateWrapper>
                    <DateContainer style={{ marginBottom: '20px' }}>
                      <DateContent style={{ width: `${71 * 7}px` }}>
                        {daysList.map(({ date, day }, i) => (
                          <DateCard key={i} active={!!(activeDate === i)}>
                            <h3>{date}</h3>
                            <span>{day}</span>
                          </DateCard>
                        ))}
                      </DateContent>
                    </DateContainer>
                  </DateWrapper>
                  <SearchSelect name="test" label="teste de pesquisa" />
                  <Input
                    type="text"
                    label="Pesquisar por nome"
                    name="search"
                    style={{ marginBottom: '16px' }}
                  />

                  <Button onClick={handleClick}>teste</Button>

                  <Select
                    options={[
                      { value: 'chocolate', label: 'Chocolate' },
                      { value: 'strawberry', label: 'Strawberry' },
                      { value: 'vanilla', label: 'Vanilla' }
                    ]}
                    label="teste"
                    value="vanilla"
                    name="teste"
                    disabled
                  />

                  {/* {posts.map(post => (
                    <Card key={post.id}>
                      <div className="card-info">
                        <h4>{post.title}</h4>
                        <p>{post.body}</p>
                      </div>
                      <div className="card-image">
                        <CardBack />
                      </div>
                    </Card>
                  ))} */}

                  {data.coordinates.map(coordinate => (
                    <div key={coordinate.id}>{coordinate.latitude}</div>
                  ))}

                  <Card>
                    <div className="card-info">
                      <h4>Colheita de Laranjas</h4>
                      <p>Observações</p>
                    </div>
                    <div className="card-image">
                      <CardBack />
                    </div>
                  </Card>
                </CardContainer>
              )) || <Loader />}
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(ProducerNotebook);
// export default ProducerNotebook;

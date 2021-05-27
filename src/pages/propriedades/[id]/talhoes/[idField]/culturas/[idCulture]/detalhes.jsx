import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faSeedling } from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import Loader from '@/components/Loader';

import { useFetch } from '@/hooks/useFetch';

import { dateToInput } from '@/helpers/date';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';

function CulturasInfo() {
  const router = useRouter();
  const { id, idField, idCulture } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${idField}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${idCulture}`
  );

  const { types } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  useEffect(() => {
    setRoute(urlRoute(router, types));
  }, []);

  if (error || errorCultures) return <Error error={error || errorCultures} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Cultura - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              {data && dataCultures && (
                <Breadcrumb
                  path={[
                    { route: '/', name: 'Home' },
                    {
                      route: '/tecnico',
                      name: 'Painel Técnico',
                      active:
                        types === 'technician' && route?.permission === types
                    },
                    {
                      route: '/admin',
                      name: 'Painel Administrativo',
                      active:
                        types === 'administrator' && route?.permission === types
                    },
                    { route: `${route.path}`, name: 'Propriedades' },
                    {
                      route: `${route.path}/${id}/detalhes`,
                      name: `${data?.properties.name}`
                    },
                    {
                      route: `${route.path}/${id}/talhoes`,
                      name: `Talhões`
                    },
                    {
                      route: `${route.path}/${id}/talhoes/${idField}/detalhes`,
                      name: `${data?.name}`
                    },
                    {
                      route: `${route.path}/${id}/talhoes/${idField}/culturas`,
                      name: `Culturas`
                    },
                    {
                      route: `${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}/detalhes`,
                      name: `${dataCultures?.products.name}`
                    }
                  ]}
                />
              )}
              <h2>Informações Cultura {`(${dataCultures?.products.name})`}</h2>
              <p>
                Você está vendo informações detalhadas da cultura de{' '}
                {dataCultures?.products.name} no talhão{' '}
                {`${data?.name} da propriedade ${data?.properties.name}`}.
              </p>
              <div className="buttons__container">
                <Link
                  href={`${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}/colheitas`}
                >
                  <Button className="primary">
                    <FontAwesomeIcon icon={faSeedling} /> Ver Colheitas
                  </Button>
                </Link>
                <Link
                  href={`${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}/relatorios`}
                >
                  <Button className="primary">
                    <FontAwesomeIcon icon={faFileAlt} /> Ver Relatórios Técnicos
                  </Button>
                </Link>
              </div>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && dataCultures && (
                  <>
                    <Select
                      name="products"
                      label="Produto:"
                      options={[
                        {
                          value: dataCultures?.products.id,
                          label: dataCultures?.products.name
                        }
                      ]}
                      value={dataCultures?.products.id}
                      disabled
                    />
                    <div className="form-group">
                      <div>
                        <Input
                          type="date"
                          label="Data inicial"
                          name="date_start"
                          initialValue={dateToInput(dataCultures?.date_start)}
                          disabled
                        />
                      </div>
                      <div>
                        <Input
                          type="date"
                          label="Data final"
                          name="date_finish"
                          initialValue={dateToInput(dataCultures?.date_finish)}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div>
                        <Input
                          type="number"
                          label="Área"
                          name="area"
                          initialValue={dataCultures?.area}
                          disabled
                        />
                      </div>
                      <div>
                        <Select
                          options={[
                            {
                              value: dataCultures?.type_dimension,
                              label: dataCultures?.type_dimension
                            }
                          ]}
                          label="Unidade de medida"
                          name="type_dimension"
                          value={dataCultures?.type_dimension}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="form-group buttons">
                      <div>
                        <Button onClick={() => router.back()}>Voltar</Button>
                      </div>

                      <div>
                        <Button
                          className="primary"
                          onClick={() =>
                            router.push(
                              `${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}/editar`
                            )
                          }
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  </>
                )) || <Loader />}
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(CulturasInfo);

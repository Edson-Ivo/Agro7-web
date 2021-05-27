import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import Loader from '@/components/Loader';

import errorMessage from '@/helpers/errorMessage';
import { useFetch } from '@/hooks/useFetch';
import getFormData from '@/helpers/getFormData';
import { dateToInput, dateToISOString } from '@/helpers/date';
import HarvestsService from '@/services/HarvestsService';
import Error from '@/components/Error/index';
import urlRoute from '@/helpers/urlRoute';
import { useSelector } from 'react-redux';
import isEmpty from '@/helpers/isEmpty';

const schema = yup.object().shape({
  date: yup.string().required('O campo data é obrigatório!'),
  forecast: yup.string().required('O campo data previsão é obrigatório!'),
  quantity: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required('A quantidade precisa ser definida')
    .positive('A quantidade precisa ser um valor positivo'),
  quantity_forecast: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required('A quantidade prevista precisa ser definida')
    .positive('A quantidade prevista precisa ser um valor positivo')
});

function ColheitasEdit() {
  const formRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();
  const { id, idField, idCulture, idHarvest } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${idField}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${idCulture}`
  );

  const {
    data: dataHarvests,
    error: errorHarvests,
    mutate: mutateHarvests
  } = useFetch(`/harvests/find/by/id/${idHarvest}`);

  const { types } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
    setRoute(urlRoute(router, types));
  }, []);

  const handleCancel = () => {
    router.back();
  };

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        date: null,
        forecast: null,
        quantity: null,
        quantity_forecast: null,
        cultures: null
      };
    }

    return getFormData(formRef.current, {
      date: null,
      forecast: null,
      quantity: null,
      quantity_forecast: null,
      cultures: null
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setDisableButton(true);
    schema
      .validate(getData())
      .then(async d => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        d.date = dateToISOString(d.date_start);
        d.forecast = dateToISOString(d.date_finish);

        await HarvestsService.update(idHarvest, d).then(res => {
          if (res.status !== 200 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            mutateHarvests();

            setAlert({
              type: 'success',
              message: 'Colheita editada com sucesso!'
            });

            setTimeout(() => {
              router.push(
                `/propriedades/${id}/talhoes/${idField}/culturas/${idCulture}/colheitas`
              );
              setDisableButton(false);
            }, 1000);
          }
        });
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
        setDisableButton(false);
      });
  };

  if (error || errorCultures || errorHarvests)
    return <Error error={error || errorCultures || errorHarvests} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && idField !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Editar Colheita - Agro7</title>
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
                      route: `/propriedades/${id}/detalhes`,
                      name: `${data?.properties.name}`
                    },
                    {
                      route: `/propriedades/${id}/talhoes`,
                      name: `Talhões`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/detalhes`,
                      name: `${data?.name}`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/culturas`,
                      name: `Culturas`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/culturas/${idCulture}/detalhes`,
                      name: `${dataCultures?.products.name}`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/culturas/${idCulture}/relatorios`,
                      name: `Relatórios`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/culturas/${idCulture}/colheitas/${idHarvest}/editar`,
                      name: `Editar`
                    }
                  ]}
                />
              )}
              <h2>
                Editar Colheita na Cultura de {dataCultures?.products.name}
              </h2>
              <p>
                Aqui você irá editar a colheita da cultura de{' '}
                {dataCultures?.products.name} do talhão{' '}
                {`${data?.name} da propriedade ${data?.properties.name}`}.
              </p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                <form
                  id="registerForm"
                  ref={formRef}
                  method="post"
                  onSubmit={event => handleSubmit(event)}
                >
                  {(data && dataCultures && dataHarvests && (
                    <>
                      <div className="form-group">
                        <div>
                          <Input
                            type="date"
                            label="Data"
                            name="date"
                            initialValue={dateToInput(dataHarvests?.date)}
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            label="Quantidade (kg)"
                            name="quantity"
                            initialValue={dataHarvests?.quantity}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="date"
                            label="Data de Previsão"
                            name="forecast"
                            initialValue={dateToInput(dataHarvests?.forecast)}
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            label="Quantidade Prevista (kg)"
                            name="quantity_forecast"
                            initialValue={dataHarvests?.quantity_forecast}
                          />
                        </div>
                      </div>

                      <div className="form-group buttons">
                        <div>
                          <Button type="button" onClick={handleCancel}>
                            Cancelar
                          </Button>
                        </div>

                        <div>
                          <Button
                            disabled={disableButton}
                            className="primary"
                            type="submit"
                          >
                            Editar Colheita
                          </Button>
                        </div>
                      </div>
                    </>
                  )) || <Loader />}
                </form>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(ColheitasEdit);

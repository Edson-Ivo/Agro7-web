import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import Loader from '@/components/Loader';

import errorMessage from '@/helpers/errorMessage';
import { useFetch } from '@/hooks/useFetch';
import { dateToInput, dateToISOString } from '@/helpers/date';
import HarvestsService from '@/services/HarvestsService';
import Error from '@/components/Error/index';
import urlRoute from '@/helpers/urlRoute';
import { useSelector } from 'react-redux';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

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
  const { id, fieldId, cultureId, harvestId } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const {
    data: dataHarvests,
    error: errorHarvests,
    mutate: mutateHarvests
  } = useFetch(`/harvests/find/by/id/${harvestId}`);

  const { type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
    setRoute(urlRoute(router, type));
  }, []);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setDisableButton(true);
    schema
      .validate(e)
      .then(async d => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        d.date = dateToISOString(d.date_start);
        d.forecast = dateToISOString(d.date_finish);

        await HarvestsService.update(harvestId, d).then(res => {
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
                `/propriedades/${id}/talhoes/${fieldId}/culturas/${cultureId}/colheitas`
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
  if (dataCultures && fieldId !== String(dataCultures?.fields?.id))
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
            <SectionHeaderContent
              breadcrumb={[
                { route: '/', name: 'Home' },
                {
                  route: '/tecnico',
                  name: 'Painel Técnico',
                  active: type === 'tecnico' && route?.permission === type
                },
                {
                  route: '/admin',
                  name: 'Painel Administrativo',
                  active: type === 'administrador' && route?.permission === type
                },
                { route: `${route.path}`, name: 'Propriedades' },
                {
                  route: `/propriedades/${id}/detalhes`,
                  name: `${data?.properties?.name}`
                },
                {
                  route: `/propriedades/${id}/talhoes`,
                  name: `Talhões`
                },
                {
                  route: `/propriedades/${id}/talhoes/${fieldId}/detalhes`,
                  name: `${data?.name}`
                },
                {
                  route: `/propriedades/${id}/talhoes/${fieldId}/culturas`,
                  name: `Culturas`
                },
                {
                  route: `/propriedades/${id}/talhoes/${fieldId}/culturas/${cultureId}/detalhes`,
                  name: `${dataCultures?.products?.name}`
                },
                {
                  route: `/propriedades/${id}/talhoes/${fieldId}/culturas/${cultureId}/relatorios`,
                  name: `Relatórios`
                },
                {
                  route: `/propriedades/${id}/talhoes/${fieldId}/culturas/${cultureId}/colheitas/${harvestId}/editar`,
                  name: `Editar`
                }
              ]}
              title={`Editar Colheita na Cultura de ${dataCultures?.products?.name}`}
              description={`Aqui você irá editar a colheita da cultura de ${dataCultures?.products?.name} do talhão ${data?.name} da propriedade ${data?.properties.name}.`}
              isLoading={
                isEmpty(data) || isEmpty(dataCultures) || isEmpty(dataHarvests)
              }
            />
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

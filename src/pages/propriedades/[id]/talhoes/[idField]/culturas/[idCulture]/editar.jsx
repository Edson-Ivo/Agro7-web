import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { Form } from '@unform/web';

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
import { Alert } from '@/components/Alert';
import Loader from '@/components/Loader';

import errorMessage from '@/helpers/errorMessage';
import { useFetch } from '@/hooks/useFetch';
import CulturesService from '@/services/CulturesService';
import SearchSelect from '@/components/SearchSelect/index';
import { dateToInput, dateToISOString } from '@/helpers/date';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';

const schema = yup.object().shape({
  date_start: yup.string().required('O campo data inicial é obrigatório!'),
  date_finish: yup.string().required('O campo data final é obrigatório!'),
  area: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required('A área precisa ser definida')
    .positive('A área precisa ter um valor positivo'),
  type_dimension: yup
    .string()
    .required('Unidade de medida precisa ser definida'),
  products: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required('O produto tem que ser escolhido')
});

function CulturasEdit() {
  const formRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();
  const { id, idField, idCulture } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${idField}`);

  const { data: dataTypeDimension } = useFetch(
    '/cultures/find/all/types-dimension'
  );

  const {
    data: dataCultures,
    error: errorCultures,
    mutate: mutateCultures
  } = useFetch(`/cultures/find/by/id/${idCulture}`);

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

  const handleSubmit = async dt => {
    setDisableButton(true);

    schema
      .validate(dt)
      .then(async d => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        d.date_start = dateToISOString(d.date_start);
        d.date_finish = dateToISOString(d.date_finish);
        d.fields = Number(idField);

        await CulturesService.update(idCulture, d).then(res => {
          if (res.status !== 200 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            mutateCultures();

            setAlert({
              type: 'success',
              message: 'Cultura editada com sucesso!'
            });

            setTimeout(() => {
              router.push(
                `${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}/detalhes`
              );
              setDisableButton(false);
            }, 1000);
          }
        });
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
        setDisableButton(false);

        if (err instanceof yup.ValidationError) {
          const { path, message } = err;

          formRef.current.setFieldError(path, message);
        }
      });
  };

  if (error || errorCultures) return <Error error={error || errorCultures} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Editar Cultura - Agro7</title>
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
                      active: type === 'tecnico' && route?.permission === type
                    },
                    {
                      route: '/admin',
                      name: 'Painel Administrativo',
                      active:
                        type === 'administrador' && route?.permission === type
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
                    },
                    {
                      route: `${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}/editar`,
                      name: `Editar`
                    }
                  ]}
                />
              )}
              <h2>Editar Cultura {`(${dataCultures?.products.name})`}</h2>
              <p>
                Aqui você irá editar a cultura de {dataCultures?.products.name}{' '}
                no talhão{' '}
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
                {(data && dataCultures && dataTypeDimension && (
                  <>
                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmit}
                      initialData={{
                        ...dataCultures,
                        products: dataCultures?.products.id,
                        date_start: dateToInput(dataCultures?.date_start),
                        date_finish: dateToInput(dataCultures?.date_finish)
                      }}
                    >
                      <SearchSelect
                        name="products"
                        label="Digite o nome do produto:"
                        url="/products/find/all"
                        options={[
                          {
                            value: dataCultures?.products.id,
                            label: dataCultures?.products.name
                          }
                        ]}
                      />
                      <div className="form-group">
                        <div>
                          <Input
                            type="date"
                            label="Data inicial"
                            name="date_start"
                          />
                        </div>
                        <div>
                          <Input
                            type="date"
                            label="Data final"
                            name="date_finish"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input type="number" label="Área" name="area" />
                        </div>
                        <div>
                          <Select
                            options={dataTypeDimension?.typesDimension.map(
                              dimension => ({
                                value: dimension,
                                label: dimension
                              })
                            )}
                            label="Unidade de medida"
                            name="type_dimension"
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
                            Salvar Cultura
                          </Button>
                        </div>
                      </div>
                    </Form>
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

export default privateRoute()(CulturasEdit);

import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import { MapActionPlotArea } from '@/components/MapApp';
import Loader from '@/components/Loader';

import errorMessage from '@/helpers/errorMessage';
import { useFetch } from '@/hooks/useFetch';
import FieldsService from '@/services/FieldsService';
import isEmpty from '@/helpers/isEmpty';
import areaConversor from '@/helpers/areaConversor';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import scrollTo from '@/helpers/scrollTo';
import useUserAccess from '@/hooks/useUserAccess';
import LogoLoader from '@/components/Loader/LogoLoader';

const schema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório!'),
  area: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required('A área precisa ser definida')
    .positive('A área precisa ter um valor positivo'),
  type_dimension: yup
    .string()
    .required('Unidade de medida precisa ser definida')
});

function TalhoesCadastrar() {
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [dataArea, setDataArea] = useState(0.0);

  const router = useRouter();
  const { id, createProperty } = router.query;

  const { type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);
  const { data: dataTypeDimension } = useFetch(
    '/fields/find/all/types-dimension'
  );

  const [userAccess, loadingUserAccess] = useUserAccess(route, data?.users?.id);

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
    setRoute(urlRoute(router, type));
  }, []);

  const handleCancel = () => {
    if (createProperty) {
      router.push(`${route.path}/${id}/detalhes`);
    } else {
      router.back();
    }
  };

  const handleCoordinates = path => {
    if (!isEmpty(path)) setCoordinates([...coordinates, path]);
    else setCoordinates([]);
  };

  const handleChangeTypeDimension = e => {
    handleAreaCalc(dataArea, e?.value);
  };

  const handleAreaCalc = (area, dim = null) => {
    const dimension = dim || formRef.current.getFieldValue('type_dimension');

    setDataArea(area);

    formRef.current.setFieldValue('area', areaConversor(area, dimension));
  };

  const handleSubmit = async dt => {
    setDisableButton(true);

    schema
      .validate(dt)
      .then(async d => {
        if (!isEmpty(coordinates)) {
          setAlert({
            type: 'success',
            message: 'Enviando...'
          });

          scrollTo(alertRef);

          d.properties = Number(id);
          d.coordinates = coordinates;

          await FieldsService.create(d).then(res => {
            if (res.status !== 201 || res?.statusCode) {
              setAlert({ type: 'error', message: errorMessage(res) });
              setTimeout(() => {
                setDisableButton(false);
              }, 1000);
            } else {
              setAlert({
                type: 'success',
                message: 'Talhão cadastrado com sucesso!'
              });

              if (createProperty) {
                setTimeout(() => {
                  router.push(`${route.path}/${id}/detalhes`);
                  setDisableButton(false);
                }, 1000);
              } else {
                router.push(
                  `${route.path}/${id}/talhoes/${res.data.id}/detalhes`
                );
              }
            }
          });
        } else {
          setAlert({
            type: 'error',
            message: 'Por favor, desenhe o talhão no mapa'
          });
          setDisableButton(false);
        }
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

  if (loadingUserAccess) return <LogoLoader />;

  if (error) return <Error error={error} />;
  if (
    (!isEmpty(route) && !route.hasPermission) ||
    (!loadingUserAccess && !userAccess)
  )
    return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Cadastrar Talhão - Agro9</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%propriedade': data?.name
              }}
              title={`Cadastrar Talhão ${data?.name}`}
              description={`Aqui, você irá cadastrar um talhão para propriedade ${data?.name}`}
              isLoading={isEmpty(data)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type} ref={alertRef}>
                    {alert.message}
                  </Alert>
                )}
                {(data && dataTypeDimension && (
                  <>
                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmit}
                      initialData={{ type_dimension: 'ha' }}
                    >
                      <Input type="text" name="name" label="Nome do talhão" />

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
                            onChange={handleChangeTypeDimension}
                          />
                        </div>
                      </div>

                      <MapActionPlotArea
                        initialPosition={[
                          data.coordinates.latitude,
                          data.coordinates.longitude
                        ]}
                        onClick={handleCoordinates}
                        onAreaCalc={handleAreaCalc}
                      />

                      <div className="form-group buttons">
                        <div>
                          <Button type="button" onClick={handleCancel}>
                            {(createProperty && 'Cadastrar depois') ||
                              'Cancelar'}
                          </Button>
                        </div>
                        <div>
                          <Button
                            disabled={disableButton}
                            className="primary"
                            type="submit"
                          >
                            Cadastrar Talhão
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

export default privateRoute()(TalhoesCadastrar);

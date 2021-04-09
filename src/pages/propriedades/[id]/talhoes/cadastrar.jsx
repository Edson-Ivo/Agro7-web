import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';

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
import { MapActionPlotArea } from '@/components/MapApp';
import Loader from '@/components/Loader';

import errorMessage from '@/helpers/errorMessage';
import { useFetch } from '@/hooks/useFetch';
import FieldsService from '@/services/FieldsService';
import getFormData from '@/helpers/getFormData';
import isEmpty from '@/helpers/isEmpty';

const schema = yup.object().shape({
  name: yup
    .string()
    .min(4, 'O nome precisa ter no mínimo 4 caracteres')
    .required('O campo nome é obrigatório!'),
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
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [activeStep, setActiveStep] = useState(1);

  const router = useRouter();
  const { id, createProperty } = router.query;

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);
  const { data: dataTypeDimension } = useFetch(
    '/fields/find/all/types-dimension'
  );

  useEffect(
    () => () => {
      setAlert({ type: '', message: '' });
      setDisableButton(false);
    },
    []
  );

  const handleCancel = () => {
    if (createProperty) {
      router.push(`/propriedades/${id}/detalhes`);
    } else {
      router.back();
    }
  };

  const handleCoordinates = path => {
    if (!isEmpty(path)) setCoordinates([...coordinates, path]);
    else setCoordinates([]);
  };

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        name: null,
        area: null,
        type_dimension: null,
        coordinates: []
      };
    }

    return getFormData(formRef.current, {
      name: null,
      area: null,
      type_dimension: null,
      coordinates: []
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setDisableButton(true);
    schema
      .validate(getData())
      .then(async d => {
        if (!isEmpty(coordinates)) {
          setAlert({
            type: 'success',
            message: 'Enviando...'
          });

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
                  router.push(`/propriedades/${id}/detalhes`);
                  setDisableButton(false);
                }, 1000);
              } else {
                router.push(
                  `/propriedades/${id}/talhoes/${res.data.id}/detalhes`
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
      });
  };

  return (
    <>
      {error && router.back()}
      <Head>
        <title>Adicionar Talhão - Agro7</title>
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
                  { route: '/propriedades', name: 'Propriedades' }
                ]}
              />
              <h2>Adicionar Talhão {`(${data && data.name})`}</h2>
              <p>
                Aqui você irá adicionar um talhão para propriedade{' '}
                {data && data.name}
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
                  {(data && dataTypeDimension && (
                    <>
                      <MultiStep activeStep={activeStep}>
                        <Step label="Dados" onClick={() => setActiveStep(1)}>
                          <h4 className="step-title">Dados do Talhão</h4>

                          <Input
                            type="text"
                            name="name"
                            label="Nome do talhão"
                          />
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
                        </Step>
                        <Step
                          label="Desenhar Talhão"
                          onClick={() => setActiveStep(2)}
                        >
                          <h4 className="step-title">
                            Clique sobre o mapa para criar os pontos do talhão
                          </h4>
                          <MapActionPlotArea
                            initialPosition={[
                              data.coordinates.latitude,
                              data.coordinates.longitude
                            ]}
                            onClick={handleCoordinates}
                          />
                        </Step>
                      </MultiStep>
                      <div className="form-group buttons">
                        {(activeStep !== 1 && (
                          <div>
                            <Button
                              type="button"
                              onClick={() => setActiveStep(activeStep - 1)}
                            >
                              Voltar
                            </Button>
                          </div>
                        )) || (
                          <div>
                            <Button type="button" onClick={handleCancel}>
                              {(createProperty && 'Adicionar depois') ||
                                'Cancelar'}
                            </Button>
                          </div>
                        )}
                        <div>
                          {activeStep !== 2 && (
                            <Button
                              type="button"
                              onClick={() => setActiveStep(activeStep + 1)}
                              className="primary"
                            >
                              Continuar
                            </Button>
                          )}

                          {activeStep === 2 && (
                            <Button
                              disabled={disableButton}
                              className="primary"
                              type="submit"
                            >
                              Adicionar Talhão
                            </Button>
                          )}
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

export default privateRoute()(TalhoesCadastrar);

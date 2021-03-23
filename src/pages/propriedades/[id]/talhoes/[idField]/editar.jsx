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

import errorMessage from '@/helpers/errorMessage';
import { useFetch } from '@/hooks/useFetch';
import FieldsService from '@/services/FieldsService';
import getFormData from '@/helpers/getFormData';
import { MapActionPlotArea } from '@/components/MapApp';
import isEmpty from '@/helpers/isEmpty';
import Loader from '@/components/Loader';

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

function TalhoesCreate() {
  const formRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [activeStep, setActiveStep] = useState(1);

  const router = useRouter();
  const { id, idField } = router.query;

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  const { data: dataFields, error: errorFields } = useFetch(
    `/fields/find/by/id/${idField}`
  );

  const { data: dataTypeDimension, error: errorTypeDimension } = useFetch(
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
    router.back();
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
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        d.coordinates = !isEmpty(coordinates)
          ? coordinates
          : dataFields.coordinates;

        await FieldsService.update(idField, d).then(res => {
          if (res.status !== 200 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            setAlert({
              type: 'success',
              message: 'Talhão editado com sucesso!'
            });

            setTimeout(() => {
              router.push(`/propriedades/${id}/talhoes/${idField}/detalhes`);
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

  return (
    <>
      {(error || errorFields) && router.back()}
      <Head>
        <title>Editar Talhão - Agro7</title>
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
              <h2>Editar Talhão {`(${dataFields && dataFields.name})`}</h2>
              <p>
                Você está editando o talhão {dataFields && dataFields.name} da
                propriedade {data && data.name}.
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
                  {(data && dataTypeDimension && dataFields && (
                    <>
                      <MultiStep activeStep={activeStep}>
                        <Step label="Dados" onClick={() => setActiveStep(1)}>
                          <h4 className="step-title">Dados do Talhão</h4>

                          <Input
                            type="text"
                            name="name"
                            label="Nome do talhão"
                            initialValue={dataFields.name}
                          />
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                label="Área"
                                name="area"
                                initialValue={dataFields.area}
                              />
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
                                value={dataFields.type_dimension}
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
                            initialPath={dataFields.coordinates}
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
                              Cancelar
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
                              Salvar
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

export default privateRoute()(TalhoesCreate);

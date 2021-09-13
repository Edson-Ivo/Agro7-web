import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import { Form } from '@unform/web';
import { Scope } from '@unform/core';

import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';

import { MapActionGetLatLng } from '@/components/MapApp';

import { privateRoute } from '@/components/PrivateRoute';
import capitalize from '@/helpers/capitalize';
import { Alert } from '@/components/Alert/index';

import errorMessage from '@/helpers/errorMessage';

import PropertiesService from '@/services/PropertiesService';
import { useRouter } from 'next/router';
import { useFetch } from '@/hooks/useFetch';
import AddressesService from '@/services/AddressesService';
import Loader from '@/components/Loader/index';
import Error from '@/components/Error/index';
import urlRoute from '@/helpers/urlRoute';
import { useSelector } from 'react-redux';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import maskString from '@/helpers/maskString';

const schema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório!'),
  area: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required('A área precisa ser definida')
    .positive('A área precisa ter um valor positivo'),
  type_dimension: yup
    .string()
    .required('Unidade de medida precisa ser definida'),
  type_owner: yup.string().min(1).required(),
  coordinates: yup.object().shape({
    latitude: yup
      .number()
      .transform(value => (Number.isNaN(value) ? undefined : value))
      .required('A latitute é obrigatória'),
    longitude: yup
      .number()
      .transform(value => (Number.isNaN(value) ? undefined : value))
      .required('A longitude é obrigatória')
  }),
  addresses: yup.object().shape({
    state: yup
      .string()
      .min(2, 'O estado tem que ter no mínimo 2 caracteres')
      .max(15, 'Você não pode ultrapassar 15 caracteres no nome do estado')
      .required('Você precisa informar o estado da propriedade.'),
    city: yup
      .string()
      .min(2, 'O nome da cidade tem que ter no mínimo 2 caracteres')
      .max(50, 'O nome da cidade não pode ultrapassar 50 caracteres')
      .required('Você precisa informar a cidade da propriedade'),
    postcode: yup
      .string()
      .min(
        9,
        'Você tem que digitar no mínimo e no máximo 9 caracteres para o CEP. Ex: 00000-000'
      )
      .max(
        9,
        'Você tem que digitar no mínimo e no máximo 9 caracteres para o CEP. Ex: 00000-000'
      )
      .required('Você precisa informar o CEP da propriedade'),
    locality: yup
      .string()
      .max(250, 'O logradouro não pode ultrapassar 250 caracteres')
      .required('Você precisa informar o logradouro da propriedade'),
    access: yup
      .string()
      .max(250, 'O acesso não pode ultrapassar 250 caracteres')
      .nullable()
  })
});

function PropertiesEdit() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, mutate } = useFetch(`/properties/find/by/id/${id}`);

  const { data: dataTypeOwner } = useFetch('/properties/find/all/types-owner');

  const { data: dataTypeDimension } = useFetch(
    '/properties/find/all/types-dimension'
  );

  const formRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const { type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
    setActiveStep(1);
    setLoadingAddresses(false);
    setRoute(urlRoute(router, type));
  }, []);

  const handleChangeCep = e => {
    const { value } = e.target;
    if (value.length === 9) {
      setLoadingAddresses(true);

      AddressesService.getCep(value.replace('-', '')).then(
        ({ data: dataAddressCep }) => {
          if (!isEmpty(dataAddressCep)) {
            const { state, city } = dataAddressCep;

            formRef.current.setFieldValue('state', state);
            formRef.current.setFieldValue('city', city);
          }

          setLoadingAddresses(false);
        }
      );
    }
  };

  const handleLatLng = positions => {
    formRef.current.setFieldValue('coordinates.latitude', positions[0]);
    formRef.current.setFieldValue('coordinates.longitude', positions[1]);
  };

  const handleCancelEdit = e => {
    e.preventDefault();
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

        await PropertiesService.update(id, d).then(async res => {
          if (res.status >= 400 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            mutate();

            setAlert({
              type: 'success',
              message: 'Propriedade atualizada com sucesso!'
            });

            setTimeout(() => {
              router.push(`${route.path}/${id}/detalhes`);
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

  if (error) return <Error error={error} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Editando propriedade - Agro7</title>
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
              title={`Editar propriedade ${data?.name}`}
              description="Aqui você irá editar a propriedade em questão"
              isLoading={isEmpty(data)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}

                {(data && dataTypeOwner && dataTypeDimension && (
                  <>
                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmit}
                      initialData={{
                        ...data,
                        area: maskString(data?.area, 'area'),
                        addresses: {
                          ...data?.addresses,
                          postcode:
                            maskString(data?.addresses?.postcode, 'postcode') ||
                            ''
                        }
                      }}
                    >
                      <MultiStep activeStep={activeStep}>
                        <Step label="Dados" onClick={() => setActiveStep(1)}>
                          <h4 className="step-title">Dados da Propriedade</h4>

                          <div className="form-group">
                            <div>
                              <Input
                                type="text"
                                label="Nome da propriedade"
                                name="name"
                              />
                            </div>
                            <div>
                              <Select
                                options={dataTypeOwner?.typesOwner.map(
                                  owner => ({
                                    value: owner,
                                    label: capitalize(owner)
                                  })
                                )}
                                label="Quem é você para esta propriedade?"
                                name="type_owner"
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
                          <Scope path="addresses">
                            <div className="form-group">
                              <div>
                                <Input
                                  type="text"
                                  label="CEP"
                                  name="postcode"
                                  mask="cep"
                                  disabled={loadingAddresses}
                                  handleChange={handleChangeCep}
                                />
                              </div>
                              <div>
                                <Input
                                  type="text"
                                  label="Estado"
                                  name="state"
                                />
                              </div>
                              <div>
                                <Input type="text" label="Cidade" name="city" />
                              </div>
                            </div>
                            <div>
                              <Input
                                type="text"
                                label="Logradouro"
                                name="locality"
                              />
                            </div>
                            <div>
                              <Input type="text" label="Acesso" name="access" />
                            </div>
                          </Scope>
                        </Step>
                        <Step
                          label="Localização"
                          onClick={() => setActiveStep(2)}
                        >
                          <h4 className="step-title">Selecionar Localização</h4>

                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                label="Latitude"
                                name="coordinates.latitude"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                label="Longitude"
                                name="coordinates.longitude"
                              />
                            </div>
                          </div>

                          <div style={{ marginBottom: '20px' }}>
                            <MapActionGetLatLng
                              onClick={handleLatLng}
                              positions={[
                                data.coordinates.latitude,
                                data.coordinates.longitude
                              ]}
                            />
                          </div>
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
                            <Button type="button" onClick={handleCancelEdit}>
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

export default privateRoute()(PropertiesEdit);

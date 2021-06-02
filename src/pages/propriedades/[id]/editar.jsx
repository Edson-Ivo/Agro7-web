import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
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

import { MapActionGetLatLng } from '@/components/MapApp';

import { privateRoute } from '@/components/PrivateRoute';
import getFormData from '@/helpers/getFormData';
import capitalize from '@/helpers/capitalize';
import { Alert } from '@/components/Alert/index';

import errorMessage from '@/helpers/errorMessage';

import PropertiesService from '@/services/PropertiesService';
import CoordinatesService from '@/services/CoordinatesService';
import { useRouter } from 'next/router';
import { useFetch } from '@/hooks/useFetch';
import AddressesService from '@/services/AddressesService';
import Loader from '@/components/Loader/index';
import Error from '@/components/Error/index';
import urlRoute from '@/helpers/urlRoute';
import { useSelector } from 'react-redux';
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
    .required('Unidade de medida precisa ser definida'),
  type_owner: yup.string().min(1).required(),
  latitude: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required('A latitute é obrigatória'),
  longitude: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required('A longitude é obrigatória'),
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

  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const postalcodeRef = useRef(null);
  const latitudeRef = useRef(null);
  const longitudeRef = useRef(null);

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
    setActiveStep(1);
    setLoadingAddresses(false);
    setRoute(urlRoute(router, type));
  }, []);

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        name: null,
        area: null,
        type_dimension: 'm',
        type_owner: 'proprietario',
        latitude: null,
        longitude: null,
        state: null,
        city: null,
        postcode: null,
        locality: null,
        access: null
      };
    }

    return getFormData(formRef.current, {
      name: null,
      area: null,
      type_dimension: 'm',
      type_owner: 'proprietario',
      latitude: null,
      longitude: null,
      state: null,
      city: null,
      postcode: null,
      locality: null,
      access: null
    });
  };

  const handleChangeCep = e => {
    const { value } = e.target;
    if (value.length === 9) {
      setLoadingAddresses(true);

      AddressesService.getCep(value.replace('-', '')).then(
        ({ data: dataAddressCep }) => {
          if (!isEmpty(dataAddressCep)) {
            const { state, city } = dataAddressCep;
            if (!stateRef.current.value) stateRef.current.setValue(state);
            if (!cityRef.current.value) cityRef.current.setValue(city);
          }

          setLoadingAddresses(false);
        }
      );
    }
  };

  const handleLatLng = positions => {
    latitudeRef.current.setValue(positions[0]);
    longitudeRef.current.setValue(positions[1]);
  };

  const handleCancelEdit = e => {
    e.preventDefault();
    router.back();
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

        const { state, city, postcode, locality, access } = d;

        d.addresses = {
          state,
          city,
          postcode,
          locality,
          access
        };

        await PropertiesService.update(id, d).then(async res => {
          if (res.status >= 400 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            CoordinatesService.update(data.coordinates.id, d).then(
              async res3 => {
                if (res3.status >= 400 || res3?.statusCode) {
                  setAlert({
                    type: 'error',
                    message: errorMessage(res3)
                  });
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
              }
            );
          }
        });
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
        setDisableButton(false);
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
            <div className="SectionHeader__content">
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
                  { route: `${route.path}/${id}/editar`, name: 'Editar' }
                ]}
              />
              <h2>Editar propriedade {`(${data && data.name})`}</h2>
              <p>Aqui você irá editar a propriedade em questão</p>
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
                  {(data && dataTypeOwner && dataTypeDimension && (
                    <MultiStep activeStep={activeStep}>
                      <Step label="Dados" onClick={() => setActiveStep(1)}>
                        <h4 className="step-title">Dados da Propriedade</h4>

                        <div className="form-group">
                          <div>
                            <Input
                              type="text"
                              label="Nome da propriedade"
                              name="name"
                              initialValue={data.name}
                            />
                          </div>
                          <div>
                            <Select
                              options={dataTypeOwner?.typesOwner.map(owner => ({
                                value: owner,
                                label: capitalize(owner)
                              }))}
                              label="Quem é você para esta propriedade?"
                              value={data.type_owner}
                              name="type_owner"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              label="Área"
                              name="area"
                              initialValue={data.area}
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
                              value={data.type_dimension}
                              name="type_dimension"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="text"
                              label="CEP"
                              name="postcode"
                              initialValue={data.addresses.postcode}
                              mask="cep"
                              disabled={loadingAddresses}
                              ref={postalcodeRef}
                              handleChange={handleChangeCep}
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              label="Estado"
                              name="state"
                              initialValue={data.addresses.state}
                              ref={stateRef}
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              label="Cidade"
                              name="city"
                              initialValue={data.addresses.city}
                              ref={cityRef}
                            />
                          </div>
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Logradouro"
                            name="locality"
                            initialValue={data?.addresses?.locality}
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Acesso"
                            name="access"
                            initialValue={data?.addresses?.access || ''}
                          />
                        </div>
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
                              name="latitude"
                              initialValue={data.coordinates.latitude}
                              ref={latitudeRef}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              label="Longitude"
                              name="longitude"
                              initialValue={data.coordinates.longitude}
                              ref={longitudeRef}
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
                  )) || <Loader />}

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
                </form>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(PropertiesEdit);

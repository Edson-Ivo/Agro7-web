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
import areaConversor from '@/helpers/areaConversor';
import Error from '@/components/Error/index';
import urlRoute from '@/helpers/urlRoute';
import { useSelector } from 'react-redux';

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

function TalhoesEdit() {
  const formRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [coordinates, setCoordinates] = useState([]);

  const areaRef = useRef(null);
  const typeDimensionRef = useRef(null);

  const router = useRouter();
  const { id, idField } = router.query;

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  const {
    data: dataFields,
    error: errorFields,
    mutate: mutateFields
  } = useFetch(`/fields/find/by/id/${idField}`);

  const { data: dataTypeDimension } = useFetch(
    '/fields/find/all/types-dimension'
  );

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

  const handleCoordinates = path => {
    if (!isEmpty(path)) setCoordinates([...coordinates, path]);
    else setCoordinates([]);
  };

  const handleAreaCalc = area => {
    const { value: dimension } = typeDimensionRef.current;

    areaRef.current.setValue(areaConversor(area, dimension));
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
            mutateFields();

            setAlert({
              type: 'success',
              message: 'Talhão editado com sucesso!'
            });

            setTimeout(() => {
              router.push(`${route.path}/${id}/talhoes/${idField}/detalhes`);
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

  if (error || errorFields) return <Error error={error || errorFields} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Editar Talhão - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              {data && (
                <Breadcrumb
                  path={[
                    { route: '/', name: 'Home' },
                    {
                      route: '/tecnico',
                      name: 'Painel Técnico',
                      active: route && route.permission === types
                    },
                    { route: `${route.path}`, name: 'Propriedades' },
                    {
                      route: `${route.path}/${id}/detalhes`,
                      name: `${data?.name}`
                    },
                    {
                      route: `${route.path}/${id}/talhoes`,
                      name: `Talhões`
                    },
                    {
                      route: `${route.path}/${id}/talhoes/${idField}/editar`,
                      name: `Editar`
                    }
                  ]}
                />
              )}
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
                            ref={areaRef}
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
                            ref={typeDimensionRef}
                            value={dataFields.type_dimension}
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
                        initialPath={dataFields.coordinates}
                      />

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
                            Salvar
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

export default privateRoute()(TalhoesEdit);

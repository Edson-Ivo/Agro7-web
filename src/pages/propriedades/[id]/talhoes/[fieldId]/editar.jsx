import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as yup from 'yup';
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

import errorMessage from '@/helpers/errorMessage';
import { useFetch } from '@/hooks/useFetch';
import FieldsService from '@/services/FieldsService';
import { MapActionPlotArea } from '@/components/MapApp';
import isEmpty from '@/helpers/isEmpty';
import Loader from '@/components/Loader';
import areaConversor from '@/helpers/areaConversor';
import Error from '@/components/Error/index';
import urlRoute from '@/helpers/urlRoute';
import { useSelector } from 'react-redux';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

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

function TalhoesEdit() {
  const formRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [dataArea, setDataArea] = useState(0.0);

  const router = useRouter();
  const { id, fieldId } = router.query;

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  const {
    data: dataFields,
    error: errorFields,
    mutate: mutateFields
  } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataTypeDimension } = useFetch(
    '/fields/find/all/types-dimension'
  );

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
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        d.coordinates = !isEmpty(coordinates)
          ? coordinates
          : dataFields.coordinates;

        await FieldsService.update(fieldId, d).then(res => {
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
              router.push(`${route.path}/${id}/talhoes/${fieldId}/detalhes`);
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
            <SectionHeaderContent
              breadcrumbTitles={{
                '%propriedade': data?.name,
                '%talhao': dataFields?.name
              }}
              title={`Editar Talhão ${dataFields?.name}`}
              description={`Você está editando o talhão ${dataFields?.name} da propriedade ${data?.name}.`}
              isLoading={isEmpty(data) || isEmpty(dataFields)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}

                {(data && dataTypeDimension && dataFields && (
                  <>
                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmit}
                      initialData={{ ...dataFields }}
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

export default privateRoute()(TalhoesEdit);

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
import Loader from '@/components/Loader';

import errorMessage from '@/helpers/errorMessage';
import { useFetch } from '@/hooks/useFetch';
import getFormData from '@/helpers/getFormData';
import CulturesService from '@/services/CulturesService';
import SearchSelect from '@/components/SearchSelect/index';
import { dateConversor, dateToInput, dateToISOString } from '@/helpers/date';

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

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        date_start: null,
        date_finish: null,
        area: null,
        type_dimension: null,
        products: null
      };
    }

    return getFormData(formRef.current, {
      date_start: null,
      date_finish: null,
      area: null,
      type_dimension: null,
      products: null
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

        d.date_start = dateToISOString(d.date_start);
        d.date_finish = dateToISOString(d.date_finish);
        d.fields = Number(idField);

        await CulturesService.update(idCulture, d).then(res => {
          if (res.status !== 201 || res?.statusCode) {
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
                `/propriedades/${id}/talhoes/${idField}/culturas/${idCulture}/detalhes`
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

  return (
    <>
      {(error || errorCultures) && router.back()}
      {data && id !== data?.properties.id.toString() && router.back()}
      <Head>
        <title>Editar Cultura - Agro7</title>
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
                <form
                  id="registerForm"
                  ref={formRef}
                  method="post"
                  onSubmit={event => handleSubmit(event)}
                >
                  {(data && dataCultures && dataTypeDimension && (
                    <>
                      <SearchSelect
                        name="products"
                        label="Selecione o produto:"
                        url="/products/find/all"
                        value={dataCultures?.products.id}
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
                            initialValue={dateToInput(dataCultures?.date_start)}
                          />
                        </div>
                        <div>
                          <Input
                            type="date"
                            label="Data final"
                            name="date_finish"
                            initialValue={dateToInput(
                              dataCultures?.date_finish
                            )}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="number"
                            label="Área"
                            name="area"
                            initialValue={dataCultures?.area}
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
                            value={dataCultures?.type_dimension}
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
                            Editar Cultura
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

export default privateRoute()(CulturasEdit);

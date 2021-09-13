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
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import maskString from '@/helpers/maskString';

const schema = yup.object().shape({
  date_start: yup.string().required('O campo data é obrigatório!'),
  date_finish: yup.string(),
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
  const { id, fieldId, cultureId } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataTypeDimension } = useFetch(
    '/cultures/find/all/types-dimension'
  );

  const {
    data: dataCultures,
    error: errorCultures,
    mutate: mutateCultures
  } = useFetch(`/cultures/find/by/id/${cultureId}`);

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
        d.fields = Number(fieldId);

        if (!isEmpty(d?.date_finish))
          d.date_finish = dateToISOString(d.date_finish);
        else delete d.date_finish;

        await CulturesService.update(cultureId, d).then(res => {
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
                `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/detalhes`
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
            <SectionHeaderContent
              breadcrumbTitles={{
                '%propriedade': data?.properties.name,
                '%talhao': data?.name,
                '%cultura': dataCultures?.products?.name
              }}
              title={`Editar Cultura ${dataCultures?.products?.name}`}
              description={`Aqui você irá editar a cultura de ${dataCultures?.products?.name} no talhão ${data?.name} da propriedade ${data?.properties?.name}`}
              isLoading={isEmpty(data) || isEmpty(dataCultures)}
            />
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
                        date_finish: dataCultures?.date_finish
                          ? dateToInput(dataCultures?.date_finish)
                          : null,
                        area: maskString(dataCultures?.area, 'area')
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
                          <Input type="date" label="Data" name="date_start" />
                        </div>
                        <div>
                          <Input
                            type="date"
                            label="Data de Término (opcional)"
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

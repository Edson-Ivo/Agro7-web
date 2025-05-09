import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import Loader from '@/components/Loader';
import Select from '@/components/Select';

import errorMessage from '@/helpers/errorMessage';
import { useFetch } from '@/hooks/useFetch';
import { dateToISOString } from '@/helpers/date';
import HarvestsService from '@/services/HarvestsService';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import scrollTo from '@/helpers/scrollTo';
import { useModal } from '@/hooks/useModal';
import usersTypes from '@/helpers/usersTypes';

const schema = yup.object().shape({
  date: yup.string().required('O campo data é obrigatório!'),
  forecast: yup.string().nullable(),
  quantity: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('A quantidade precisa ser um valor positivo')
    .required('A quantidade precisa ser definida'),
  quantity_forecast: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .nullable(),
  type: yup.string().required('Unidade de medida obrigatória!'),
  is_green: yup
    .boolean()
    .required('Deve selecionar se o produto está verde ou não!')
});

function ColheitasCreate() {
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();
  const { id, fieldId, cultureId } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const { data: dataType } = useFetch('/harvests/find/all/types');

  const { type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  const { addModal, removeModal } = useModal();

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
    setRoute(urlRoute(router, type, [usersTypes[3], usersTypes[4]]));
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

        scrollTo(alertRef);

        d.date = dateToISOString(d.date);
        d.cultures = Number(cultureId);
        if (!isEmpty(d?.forecast)) d.forecast = dateToISOString(d.forecast);
        else delete d?.forecast;

        handleConfirmCreateHarvest(d);
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

  const handleCreateHarvest = async d => {
    removeModal();

    await HarvestsService.create(d).then(res => {
      if (res.status !== 201 || res?.statusCode) {
        setAlert({ type: 'error', message: errorMessage(res) });
        setTimeout(() => {
          setDisableButton(false);
        }, 1000);
      } else {
        setAlert({
          type: 'success',
          message: 'Colheita registrada com sucesso!'
        });

        setTimeout(() => {
          router.push(
            `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/colheitas`
          );
          setDisableButton(false);
        }, 1000);
      }
    });
  };

  const handleConfirmCreateHarvest = useCallback(
    d => {
      addModal({
        title: 'Cadastrar nova Colheita?',
        text:
          'Antes de confirmar o cadastro dessa colheita, verifique se os dados foram inseridos corretamente, pois não poderão ser editados.',
        confirm: true,
        onConfirm: () => handleCreateHarvest(d),
        onCancel: () => handleCancelModal(removeModal)
      });
    },
    [addModal, removeModal, route]
  );

  const handleCancelModal = removeModalAction => {
    setDisableButton(false);
    setAlert({
      type: 'info',
      message:
        'Você está revisando os dados... Após revisar, clique em Cadastrar Colheita novamente e selecione "sim" para cadastrar essa colheita.'
    });
    removeModalAction();
  };

  if (error || errorCultures) return <Error error={error || errorCultures} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && fieldId !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Cadastrar Colheita - Agro9</title>
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
              title={`Cadastrar Colheita na Cultura de ${dataCultures?.products?.name}`}
              description={`Aqui, você irá cadastrar uma colheita para cultura de ${dataCultures?.products?.name} do talhão ${data?.name} da propriedade ${data?.properties?.name}.`}
              isLoading={isEmpty(data) || isEmpty(dataCultures)}
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

                {(data && dataCultures && dataType && (
                  <>
                    <Form ref={formRef} method="post" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <div>
                          <Input type="date" label="Data" name="date" />
                        </div>
                        <div>
                          <Input
                            type="number"
                            label="Quantidade"
                            name="quantity"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="date"
                            label="Data de Previsão"
                            name="forecast"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            label="Quantidade Prevista"
                            name="quantity_forecast"
                          />
                        </div>
                      </div>
                      <div>
                        <Select
                          options={dataType?.typesHarvest.map(typeHarvest => ({
                            value: typeHarvest,
                            label: typeHarvest
                          }))}
                          label="Unidade de Medida"
                          name="type"
                        />
                      </div>
                      <div>
                        <Select
                          options={[
                            {
                              value: true,
                              label: 'Sim'
                            },
                            {
                              value: false,
                              label: 'Não'
                            }
                          ]}
                          label="O produto está verde?"
                          name="is_green"
                        />
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
                            Cadastrar Colheita
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

export default privateRoute()(ColheitasCreate);

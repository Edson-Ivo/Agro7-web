import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import * as yup from 'yup';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import Loader from '@/components/Loader';

import errorMessage from '@/helpers/errorMessage';
import { useFetch } from '@/hooks/useFetch';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';
import CulturesActionsService, {
  actionsList
} from '@/services/CulturesActionsService';
import objectKeyExists from '@/helpers/objectKeyExists';
import CulturesActionsForm from '@/components/CultureActionsForm';
import {
  dateToInput,
  dateToISOString,
  removeTimeSeconds
} from '@/helpers/date';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

function AcoesCulturaEditar() {
  const formRef = useRef(null);

  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [route, setRoute] = useState({});
  const [baseUrl, setBaseUrl] = useState('');

  const router = useRouter();
  const { id, fieldId, cultureId, actionId, type: typeAction } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const {
    data: dataActions,
    error: errorActions,
    mutate: mutateActions
  } = useFetch(`/cultures-${typeAction}/find/by/id/${actionId}`);

  const { type } = useSelector(state => state.user);

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
    setRoute(urlRoute(router, type, ['tecnico']));
  }, []);

  useEffect(() => {
    setBaseUrl(
      `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/acoes`
    );
  }, [route]);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async dt => {
    setDisableButton(true);

    const schema = CulturesActionsService.schema(typeAction);

    if (schema) {
      schema
        .validate(dt)
        .then(async d => {
          setAlert({
            type: 'success',
            message: 'Enviando...'
          });

          d.cultures = Number(cultureId);

          Object.keys(d).forEach(el => {
            if (d[el] === null || d[el] === undefined || el === 'types')
              delete d[el];
          });

          if (!isEmpty(d?.date_start) && typeAction === 'applications-supplies')
            d.date_start = dateToISOString(d.date_start);

          if (
            !isEmpty(d?.date_finish) &&
            typeAction === 'applications-supplies'
          )
            d.date_finish = dateToISOString(d.date_finish);

          await CulturesActionsService.update(actionId, d, typeAction).then(
            res => {
              if (res.status !== 200 || res?.statusCode) {
                setAlert({ type: 'error', message: errorMessage(res) });
                setTimeout(() => {
                  setDisableButton(false);
                }, 1000);
              } else {
                mutateActions();

                setAlert({
                  type: 'success',
                  message: `Ação de ${actionsList[
                    typeAction
                  ].label.toLowerCase()} editada com sucesso!`
                });

                setTimeout(() => {
                  router.replace(
                    `${baseUrl}/acoes/${typeAction}/${actionId}/detalhes`
                  );
                  setDisableButton(false);
                }, 1000);
              }
            }
          );
        })
        .catch(err => {
          setAlert({ type: 'error', message: err.errors[0] });
          setDisableButton(false);

          if (err instanceof yup.ValidationError) {
            const { path, message } = err;

            formRef.current.setFieldError(path, message);
          }
        });
    }
  };

  if (error || errorCultures || errorActions)
    return <Error error={error || errorCultures || errorActions} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && fieldId !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;
  if (!objectKeyExists(actionsList, typeAction)) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Editar Ação na Cultura - Agro7</title>
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
              title={`Editar Ação de ${actionsList[typeAction]?.label} na Cultura de ${dataCultures?.products?.name}`}
              description={`Aqui você irá editar a ação ${actionsList[
                typeAction
              ]?.label.toLowerCase()} em questão na cultura de ${
                dataCultures?.products?.name
              } do talhão ${data?.name} da propriedade ${
                data?.properties?.name
              }.`}
              isLoading={
                isEmpty(data) || isEmpty(dataCultures) || isEmpty(dataActions)
              }
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                {(data && dataCultures && dataActions && (
                  <>
                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmit}
                      initialData={{
                        ...dataActions,
                        date_start: dateToInput(dataActions?.date_start),
                        date_finish: dateToInput(dataActions?.date_finish),
                        time_start: removeTimeSeconds(dataActions?.time_start),
                        time_finish: removeTimeSeconds(
                          dataActions?.time_finish
                        ),
                        supplies: dataActions?.supplies?.id
                      }}
                    >
                      <CulturesActionsForm
                        typeAction={typeAction}
                        cultureId={cultureId}
                        dataAction={dataActions}
                        editForm
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
                            Salvar Edição
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

export default privateRoute()(AcoesCulturaEditar);

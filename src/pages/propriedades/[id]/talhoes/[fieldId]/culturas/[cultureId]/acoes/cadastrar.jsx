import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
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
import Select from '@/components/Select/index';
import CulturesActionsService, {
  actionsList
} from '@/services/CulturesActionsService';
import objectKeyExists from '@/helpers/objectKeyExists';
import CulturesActionsForm from '@/components/CultureActionsForm/index';
import { dateToISOString } from '@/helpers/date';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

function AcoesCulturaCadastrar() {
  const formRef = useRef(null);

  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [typeAction, setTypeAction] = useState('');
  const [route, setRoute] = useState({});
  const [baseUrl, setBaseUrl] = useState('');
  const [userSuppliesRoute, setUserSuppliesRoute] = useState('');

  const router = useRouter();
  const { id, fieldId, cultureId } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const { type, userId } = useSelector(state => state.user);

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
    setRoute(urlRoute(router, type, ['tecnico']));
  }, []);

  useEffect(() => {
    setUserSuppliesRoute('');

    if (!isEmpty(data)) {
      const userIdProperty = data?.properties?.users?.id;
      const cultesSuppliesBase = '/cultures-supplies/find/by';

      if (
        type === 'administrador' &&
        router.query?.userId === String(userIdProperty)
      ) {
        setUserSuppliesRoute(`${cultesSuppliesBase}/user/${userIdProperty}`);
      } else {
        setUserSuppliesRoute(`${cultesSuppliesBase}/user-logged`);
      }
    }
  }, [data]);

  useEffect(() => {
    setBaseUrl(`${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}`);
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

          let withAdminUserId = null;

          if (
            typeAction === 'supplies' &&
            type === 'administrador' &&
            userId !== data?.properties?.users?.id
          )
            withAdminUserId = data?.properties?.users?.id;

          d.cultures = Number(cultureId);

          Object.keys(d).forEach(el => {
            if (
              d[el] === null ||
              d[el] === undefined ||
              d[el] === '' ||
              el === 'types'
            )
              delete d[el];
          });

          if (!isEmpty(d?.date_start) && typeAction === 'applications-supplies')
            d.date_start = dateToISOString(d.date_start);

          if (
            !isEmpty(d?.date_finish) &&
            typeAction === 'applications-supplies'
          )
            d.date_finish = dateToISOString(d.date_finish);

          if (
            !isEmpty(d?.date) &&
            [
              'services',
              'others',
              'durable-goods',
              'consumable-goods'
            ].includes(typeAction)
          )
            d.date = dateToISOString(d.date);

          await CulturesActionsService.create(
            d,
            typeAction,
            withAdminUserId
          ).then(res => {
            if (res.status !== 201 || res?.statusCode) {
              setAlert({ type: 'error', message: errorMessage(res) });
              setTimeout(() => {
                setDisableButton(false);
              }, 1000);
            } else {
              setAlert({
                type: 'success',
                message: `Ação de ${actionsList[
                  typeAction
                ].label.toLowerCase()} registrada com sucesso!`
              });

              setTimeout(() => {
                router.push(
                  `${baseUrl}/acoes/${typeAction}/${res.data.id}/detalhes`
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
    }
  };

  const handleChangeTypeAction = e => {
    const typeAct = e?.value || '';

    setTypeAction(objectKeyExists(actionsList, typeAct) ? typeAct : '');
    setAlert({ type: '', message: '' });
  };

  if (error || errorCultures) return <Error error={error || errorCultures} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && fieldId !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Registrar Ação na Cultura - Agro7</title>
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
              title={`Registrar Ação na Cultura de ${dataCultures?.products?.name}`}
              description={`Aqui, você irá registrar uma ação da cultura de ${dataCultures?.products?.name} do talhão ${data?.name} da propriedade ${data?.properties?.name}.`}
              isLoading={isEmpty(data) || isEmpty(dataCultures)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                {(data && dataCultures && (
                  <>
                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmit}
                      initialData={{ types: typeAction }}
                    >
                      <Select
                        options={Object.keys(actionsList).map(action => ({
                          value: actionsList[action].value,
                          label: actionsList[action].label
                        }))}
                        label="Selecione a Ação"
                        name="types"
                        onChange={handleChangeTypeAction}
                      />

                      {typeAction && (
                        <div style={{ marginBottom: 15, marginLeft: 10 }}>
                          <h4>
                            Registrar Ação de {actionsList[typeAction]?.label}:
                          </h4>
                        </div>
                      )}

                      <CulturesActionsForm
                        typeAction={typeAction}
                        userSuppliesRoute={userSuppliesRoute}
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
                            Registrar Ação
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

export default privateRoute()(AcoesCulturaCadastrar);

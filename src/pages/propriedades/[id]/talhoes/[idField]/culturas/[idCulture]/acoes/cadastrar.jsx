import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import Loader from '@/components/Loader';

import errorMessage from '@/helpers/errorMessage';
import { useFetch } from '@/hooks/useFetch';
import getFormData from '@/helpers/getFormData';
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

function AcoesCulturaCadastrar() {
  const formRef = useRef(null);

  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [typeAction, setTypeAction] = useState('');
  const [route, setRoute] = useState({});
  const [baseUrl, setBaseUrl] = useState('');

  const router = useRouter();
  const { id, idField, idCulture } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${idField}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${idCulture}`
  );

  const { type } = useSelector(state => state.user);

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
    setRoute(urlRoute(router, type, ['tecnico']));
  }, []);

  useEffect(() => {
    setBaseUrl(`${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}`);
  }, [route]);

  const handleCancel = () => {
    router.back();
  };

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        name: null,
        value: null,
        description: null,
        date_start: null,
        time_start: null,
        date_finish: null,
        time_finish: null,
        supplies: null,
        dose: null,
        type_dose: null
      };
    }

    return getFormData(formRef.current, {
      name: null,
      value: null,
      description: null,
      date_start: null,
      time_start: null,
      date_finish: null,
      time_finish: null,
      supplies: null,
      dose: null,
      type_dose: null
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setDisableButton(true);

    const schema = CulturesActionsService.schema(typeAction);

    if (schema) {
      schema
        .validate(getData())
        .then(async d => {
          setAlert({
            type: 'success',
            message: 'Enviando...'
          });

          d.cultures = Number(idCulture);

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

          await CulturesActionsService.create(d, typeAction).then(res => {
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
                  `${baseUrl}/${typeAction}/${res.data.id}/acoes/detalhes`
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
    }
  };

  const handleChangeTypeAction = e => {
    const typeAct = e?.value || '';

    setTypeAction(objectKeyExists(actionsList, typeAct) ? typeAct : '');
    setAlert({ type: '', message: '' });
  };

  if (error || errorCultures) return <Error error={error || errorCultures} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && idField !== String(dataCultures?.fields?.id))
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
            <div className="SectionHeader__content">
              {data && dataCultures && (
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
                    {
                      route: `${route.path}/${id}/detalhes`,
                      name: `${data?.properties.name}`
                    },
                    {
                      route: `${route.path}/${id}/talhoes`,
                      name: `Talhões`
                    },
                    {
                      route: `${route.path}/${id}/talhoes/${idField}/detalhes`,
                      name: `${data?.name}`
                    },
                    {
                      route: `${route.path}/${id}/talhoes/${idField}/culturas`,
                      name: `Culturas`
                    },
                    {
                      route: `${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}/detalhes`,
                      name: `${dataCultures?.products.name}`
                    },
                    {
                      route: `${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}/acoes`,
                      name: `Ações`
                    },
                    {
                      route: `${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}/acoes/cadastrar`,
                      name: `Registrar`
                    }
                  ]}
                />
              )}
              <h2>
                Registrar Ação na Cultura de {dataCultures?.products.name}
              </h2>
              <p>
                Aqui você irá registrar uma ação na cultura de{' '}
                {dataCultures?.products.name} do talhão{' '}
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
                  {(data && dataCultures && (
                    <>
                      <Select
                        options={Object.keys(actionsList).map(action => ({
                          value: actionsList[action].value,
                          label: actionsList[action].label
                        }))}
                        label="Selecione a Ação"
                        name="types"
                        onChange={handleChangeTypeAction}
                        value={typeAction}
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
                        idCulture={idCulture}
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

export default privateRoute()(AcoesCulturaCadastrar);

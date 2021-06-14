import React, { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Button from '@/components/Button';
import TextArea from '@/components/TextArea';
import Loader from '@/components/Loader';
import { Alert } from '@/components/Alert';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';

import { useFetch } from '@/hooks/useFetch';
import { useModal } from '@/hooks/useModal';
import TechnicianActionsService from '@/services/TechnicianActionsService';
import errorMessage from '@/helpers/errorMessage';
import { dateConversor } from '@/helpers/date';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

function RelatoriosDetails() {
  const router = useRouter();
  const formRef = useRef(null);
  const { id, idField, idCulture, idAction } = router.query;
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const { addModal, removeModal } = useModal();

  const { data, error } = useFetch(`/fields/find/by/id/${idField}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${idCulture}`
  );

  const {
    data: dataActions,
    error: errorActions,
    mutate: mutateActions
  } = useFetch(`/technician-actions/find/by/id/${idAction}`);

  const { type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  useEffect(() => {
    setRoute(urlRoute(router, type));
  }, []);

  const handleSubmit = async (value = true) => {
    const concluded = !!value;
    const message = concluded
      ? 'Marcando relatório técnico como concluído. Aguarde...'
      : 'Cancelando conclusão do relatório técnico. Aguarde...';

    const d = {
      concluded,
      cultures: idCulture
    };

    setAlert({
      type: 'success',
      message
    });

    await TechnicianActionsService.update(idAction, d).then(res => {
      if (res.status !== 200 || res?.statusCode) {
        setAlert({ type: 'error', message: errorMessage(res) });
        setTimeout(() => {
          setDisableButton(false);
        }, 1000);
      } else {
        mutateActions();
        removeModal();

        const messageUpdated = concluded
          ? 'Relatório concluído com sucesso!'
          : 'Conclusão do relatório cancelada com sucesso!';

        setAlert({
          type: 'success',
          message: messageUpdated
        });

        setTimeout(() => {
          setAlert({ message: '' });
          setDisableButton(false);
        }, 3000);
      }
    });
  };

  const handleRemoveConcludedModal = useCallback(() => {
    addModal({
      title: `Cancelar conclusão?`,
      text: `Deseja realmente cancelar a conclusão desse relatório técnico?`,
      confirm: true,
      onConfirm: () => handleSubmit(false),
      onCancel: removeModal
    });
  }, [addModal, removeModal]);

  const handleCancel = () => {
    router.back();
  };

  if (error || errorCultures || errorActions)
    return <Error error={error || errorCultures || errorActions} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && idField !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Relatório Técnico - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumb={[
                { route: '/', name: 'Home' },
                {
                  route: '/tecnico',
                  name: 'Painel Técnico',
                  active: type === 'tecnico' && route?.permission === type
                },
                {
                  route: '/admin',
                  name: 'Painel Administrativo',
                  active: type === 'administrador' && route?.permission === type
                },
                { route: `${route.path}`, name: 'Propriedades' },
                {
                  route: `${route.path}/${id}/detalhes`,
                  name: `${data?.properties?.name}`
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
                  name: `${dataCultures?.products?.name}`
                },
                {
                  route: `${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}/relatorios`,
                  name: `Relatórios`
                },
                {
                  route: `${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}/relatorios/${idAction}/detalhes`,
                  name: `Detalhes`
                }
              ]}
              title={`Relatório da Cultura de ${
                dataCultures?.products?.name
              } - ${dateConversor(dataActions?.created_at, false)}`}
              description={`Aqui você vendo o relatório técnico do dia ${dateConversor(
                dataActions?.created_at,
                false
              )} da cultura de ${dataCultures?.products?.name} do talhão ${
                data?.name
              } na propriedade ${data?.properties?.name}.`}
              isLoading={
                isEmpty(data) || isEmpty(dataCultures) || isEmpty(dataActions)
              }
            >
              {dataActions && (
                <>
                  {(!dataActions?.concluded && (
                    <Button
                      type="button"
                      className="primary"
                      onClick={() => handleSubmit()}
                      disabled={disableButton}
                    >
                      <FontAwesomeIcon icon={faCheck} /> Marcar como Concluído
                    </Button>
                  )) || (
                    <Button
                      type="button"
                      onClick={() => handleRemoveConcludedModal()}
                      disabled={disableButton}
                    >
                      <FontAwesomeIcon icon={faCheck} /> Concluído
                    </Button>
                  )}
                </>
              )}
            </SectionHeaderContent>
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
                      initialData={{
                        ...dataActions
                      }}
                    >
                      <TextArea
                        name="diagnostics"
                        label="Diagnóstico da Cultura"
                        disabled
                      />
                      <TextArea
                        name="cultivation"
                        label="Tratos Culturais"
                        disabled
                      />
                      <TextArea name="fertilizing" label="Adubação" disabled />
                      <TextArea
                        name="plant_health"
                        label="Fitossanidade"
                        disabled
                      />

                      <div className="form-group buttons">
                        <div>
                          <Button type="button" onClick={handleCancel}>
                            Voltar
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

export default privateRoute()(RelatoriosDetails);

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';
import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';

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
import PDFViewer from '@/components/PDFViewer/index';

function RelatoriosDetails() {
  const router = useRouter();
  const formRef = useRef(null);
  const { id, fieldId, cultureId, actionId } = router.query;
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [activeStep, setActiveStep] = useState(1);
  const [disableButton, setDisableButton] = useState(false);
  const { addModal, removeModal } = useModal();

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const {
    data: dataActions,
    error: errorActions,
    mutate: mutateActions
  } = useFetch(`/technician-actions/find/by/id/${actionId}`);

  const { data: dataReport, error: errorReport } = useFetch(
    `/technician-actions/generate/report/by/id/${actionId}`,
    true
  );

  const { type, id: userId } = useSelector(state => state.user);
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
      cultures: cultureId
    };

    setAlert({
      type: 'success',
      message
    });

    await TechnicianActionsService.update(actionId, d).then(res => {
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

  if (error || errorCultures || errorActions || errorReport)
    return (
      <Error error={error || errorCultures || errorActions || errorReport} />
    );
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && fieldId !== String(dataCultures?.fields?.id))
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
              breadcrumbTitles={{
                '%propriedade': data?.properties.name,
                '%talhao': data?.name,
                '%cultura': dataCultures?.products?.name
              }}
              title={`Relatório da Cultura de ${
                dataCultures?.products?.name
              } - ${dateConversor(dataActions?.created_at, false)}`}
              description={`Aqui, você vendo o relatório feito pelo técnico ${
                !isEmpty(dataActions?.technicians)
                  ? dataActions?.technicians?.name
                  : 'Usuário deletado'
              } do dia ${dateConversor(
                dataActions?.created_at,
                false
              )} da cultura de ${dataCultures?.products?.name} do talhão ${
                data?.name
              } na propriedade ${data?.properties?.name}.`}
              isLoading={
                isEmpty(data) || isEmpty(dataCultures) || isEmpty(dataActions)
              }
            >
              {dataActions &&
                (data?.properties?.users?.id === userId ||
                  type === 'administrador') && (
                  <>
                    {(!dataActions?.concluded && (
                      <Button
                        type="button"
                        className="primary"
                        onClick={() => handleSubmit()}
                        disabled={disableButton}
                      >
                        <FontAwesomeIcon icon={faCheck} /> Marcar Concluído
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
                      <MultiStep activeStep={activeStep}>
                        <Step
                          label="Relatório"
                          onClick={() => setActiveStep(1)}
                        >
                          <h4 className="step-title">Relatório Técnico</h4>
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
                          <TextArea
                            name="fertilizing"
                            label="Adubação"
                            disabled
                          />
                          <TextArea
                            name="plant_health"
                            label="Fitossanidade"
                            disabled
                          />
                        </Step>
                        <Step label="Imprimir" onClick={() => setActiveStep(2)}>
                          <h4 className="step-title">
                            Imprimir/Visualizar Relatório
                          </h4>
                          <>
                            {(!isEmpty(dataReport) && (
                              <PDFViewer
                                src={`${dataReport}`}
                                name={`Relatório Técnico na Cultura de ${dataCultures?.products.name}`}
                                pdfName={`Relatório Técnico na Cultura de ${dataCultures?.products.name}.pdf`}
                                alertMessage="Se você não conseguir abrir ou visualizar o relatório, baixe-o no botão abaixo:"
                                downloadMessage="Baixar Relatório"
                                fitH
                              />
                            )) || <Loader />}
                          </>
                        </Step>
                      </MultiStep>

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

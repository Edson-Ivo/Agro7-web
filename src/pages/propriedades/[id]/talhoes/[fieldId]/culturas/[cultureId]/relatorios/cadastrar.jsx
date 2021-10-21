import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';
import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';
import Head from 'next/head';

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
import TechnicianActionsService from '@/services/TechnicianActionsService';
import TextArea from '@/components/TextArea';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import scrollTo from '@/helpers/scrollTo';
import FileInput from '@/components/FileInput/index';

const schema = yup.object().shape({
  diagnostics: yup.string().nullable(),
  cultivation: yup.string().nullable(),
  fertilizing: yup.string().nullable(),
  plant_health: yup.string().nullable()
});

function RelatoriosCreate() {
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const inputDiagnosticsRef = useRef(null);
  const inputCultivationRef = useRef(null);
  const inputFertilizingRef = useRef(null);
  const inputPlantHealthRef = useRef(null);

  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const router = useRouter();
  const { id, fieldId, cultureId } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const { type, id: userId } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
    setRoute(urlRoute(router, type));
  }, []);

  const handleSubmit = async (...{ 0: dt, 2: e }) => {
    setDisableButton(true);

    schema
      .validate(dt)
      .then(async d => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        scrollTo(alertRef);

        const isValidRegister =
          !isEmpty(d.diagnostics) ||
          !isEmpty(d.cultivation) ||
          !isEmpty(d.fertilizing) ||
          !isEmpty(d.plant_health);

        if (isValidRegister) {
          const diagnosticsFile = e.target.diagnostics_file.files;
          const cultivationFile = e.target.cultivation_file.files;
          const fertilizingFile = e.target.fertilizing_file.files;
          const plantHealthFile = e.target.plant_health_file.files;

          if (
            (diagnosticsFile.length > 0 &&
              inputDiagnosticsRef.current.error.message) ||
            (cultivationFile.length > 0 &&
              inputCultivationRef.current.error.message) ||
            (fertilizingFile.length > 0 &&
              inputFertilizingRef.current.error.message) ||
            (plantHealthFile.length > 0 &&
              inputPlantHealthRef.current.error.message)
          ) {
            setAlert({
              type: 'error',
              message:
                inputDiagnosticsRef.current.error.message ||
                inputCultivationRef.current.error.message ||
                inputFertilizingRef.current.error.message ||
                inputPlantHealthRef.current.error.message
            });
          } else if (diagnosticsFile.length > 0 && isEmpty(d.diagnostics)) {
            setAlert({
              type: 'error',
              message:
                'Você precisa escrever alguma coisa para os Diagnósticos da Cultura para inserir imagens sobre.'
            });
          } else if (cultivationFile.length > 0 && isEmpty(d.cultivation)) {
            setAlert({
              type: 'error',
              message:
                'Você precisa escrever alguma coisa para os Tratos Culturais para inserir imagens sobre.'
            });
          } else if (fertilizingFile.length > 0 && isEmpty(d.fertilizing)) {
            setAlert({
              type: 'error',
              message:
                'Você precisa escrever alguma coisa para Adubação para inserir imagens sobre.'
            });
          } else if (plantHealthFile.length > 0 && isEmpty(d.plant_health)) {
            setAlert({
              type: 'error',
              message:
                'Você precisa escrever alguma coisa para Fitossanidade para inserir imagens sobre.'
            });
          } else {
            d.cultures = Number(cultureId);

            await TechnicianActionsService.create(d).then(async res => {
              if (res.status !== 201 || res?.statusCode) {
                setAlert({ type: 'error', message: errorMessage(res) });
              } else {
                if (
                  diagnosticsFile.length > 0 ||
                  cultivationFile.length > 0 ||
                  fertilizingFile.length > 0 ||
                  plantHealthFile.length > 0
                ) {
                  const imagesFormData = new FormData();

                  for (let i = 0; i < diagnosticsFile.length; i++)
                    imagesFormData.append('diagnostics', diagnosticsFile[i]);

                  for (let i = 0; i < cultivationFile.length; i++)
                    imagesFormData.append('cultivation', cultivationFile[i]);

                  for (let i = 0; i < fertilizingFile.length; i++)
                    imagesFormData.append('fertilizing', fertilizingFile[i]);

                  for (let i = 0; i < plantHealthFile.length; i++)
                    imagesFormData.append('plant_health', plantHealthFile[i]);

                  await TechnicianActionsService.createImages(
                    res.data.id,
                    imagesFormData
                  ).then(res2 => {
                    if (res2.status !== 201 || res2?.statusCode) {
                      setAlert({
                        type: 'error',
                        message: errorMessage(res2)
                      });
                    }
                  });
                }

                setAlert({
                  type: 'success',
                  message: 'Relatório Técnico adicionado com sucesso!'
                });

                setTimeout(() => {
                  router.push(
                    `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/relatorios/${res.data.id}/detalhes`
                  );
                  setDisableButton(false);
                }, 1000);
              }
            });
          }
        } else {
          setAlert({
            type: 'error',
            message: 'Você precisa informar pelo menos 1 campo!'
          });
          setDisableButton(false);
        }
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
        setDisableButton(false);

        if (err instanceof yup.ValidationError) {
          const { path, message } = err;

          formRef.current.setFieldError(path, message);
        }
      });

    setTimeout(() => {
      setDisableButton(false);
    }, 1000);
  };

  if (error || errorCultures) return <Error error={error || errorCultures} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && fieldId !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;
  if (data && data?.properties?.users?.id === userId)
    return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Cadastrar Relatório - Agro7</title>
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
              title={`Cadastrar Relatório na Cultura de ${dataCultures?.products?.name}`}
              description={`Aqui, você irá fazer um relatório da cultura de ${dataCultures?.products?.name} do talhão ${data?.name} da propriedade ${data?.properties?.name}.`}
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

                {(data && dataCultures && (
                  <>
                    <Form ref={formRef} method="post" onSubmit={handleSubmit}>
                      <MultiStep activeStep={activeStep}>
                        <Step
                          label="Diagnóstico"
                          onClick={() => setActiveStep(1)}
                        >
                          <Alert type="info">
                            Você pode inserir somente 10 imagens para
                            diagnóstico da cultura
                          </Alert>
                          <TextArea
                            name="diagnostics"
                            label="Diagnóstico da Cultura"
                          />
                          <FileInput
                            ref={inputDiagnosticsRef}
                            name="diagnostics_file"
                            label="Selecione as fotos para o diagnóstico da cultura"
                            extensions={[
                              '.jpg',
                              '.jpeg',
                              '.png',
                              '.gif',
                              '.webp',
                              '.webm'
                            ]}
                            min={0}
                            max={10}
                          />
                        </Step>
                        <Step
                          label="Tratos Culturais"
                          onClick={() => setActiveStep(2)}
                        >
                          <Alert type="info">
                            Você pode inserir somente 10 imagens para tratos
                            culturais
                          </Alert>
                          <TextArea
                            name="cultivation"
                            label="Tratos Culturais"
                          />
                          <FileInput
                            ref={inputCultivationRef}
                            name="cultivation_file"
                            label="Selecione as fotos para o tratos culturais"
                            extensions={[
                              '.jpg',
                              '.jpeg',
                              '.png',
                              '.gif',
                              '.webp',
                              '.webm'
                            ]}
                            min={0}
                            max={10}
                          />
                        </Step>
                        <Step label="Adubação" onClick={() => setActiveStep(3)}>
                          <Alert type="info">
                            Você pode inserir somente 10 imagens para adubação
                          </Alert>
                          <TextArea name="fertilizing" label="Adubação" />
                          <FileInput
                            ref={inputFertilizingRef}
                            name="fertilizing_file"
                            label="Selecione as fotos para o adubação"
                            extensions={[
                              '.jpg',
                              '.jpeg',
                              '.png',
                              '.gif',
                              '.webp',
                              '.webm'
                            ]}
                            min={0}
                            max={10}
                          />
                        </Step>
                        <Step
                          label="Fitossanidade"
                          onClick={() => setActiveStep(4)}
                        >
                          <Alert type="info">
                            Você pode inserir somente 10 imagens para
                            fitossanidade
                          </Alert>
                          <TextArea name="plant_health" label="Fitossanidade" />
                          <FileInput
                            ref={inputPlantHealthRef}
                            name="plant_health_file"
                            label="Selecione as fotos para o fitossanidade"
                            extensions={[
                              '.jpg',
                              '.jpeg',
                              '.png',
                              '.gif',
                              '.webp',
                              '.webm'
                            ]}
                            min={0}
                            max={10}
                          />
                        </Step>
                      </MultiStep>

                      <div className="form-group buttons">
                        {(activeStep !== 1 && (
                          <div>
                            <Button
                              type="button"
                              onClick={() => setActiveStep(activeStep - 1)}
                            >
                              Voltar
                            </Button>
                          </div>
                        )) || (
                          <div>
                            <Button type="button" onClick={() => router.back()}>
                              Cancelar
                            </Button>
                          </div>
                        )}
                        <div>
                          {activeStep !== 4 && (
                            <Button
                              type="button"
                              onClick={() => setActiveStep(activeStep + 1)}
                              className="primary"
                            >
                              Continuar
                            </Button>
                          )}

                          {activeStep === 4 && (
                            <Button
                              disabled={disableButton}
                              className="primary"
                              type="submit"
                            >
                              Cadastrar Relatório
                            </Button>
                          )}
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

export default privateRoute(['tecnico'])(RelatoriosCreate);

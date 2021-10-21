import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import scrollTo from '@/helpers/scrollTo';
import FileInput from '@/components/FileInput/index';
import { dateConversor } from '@/helpers/date';
import Error from '@/components/Error/index';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/ActionButton/index';
import Table from '@/components/Table/index';

function RelatoriosEdit() {
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const inputDiagnosticsRef = useRef(null);
  const inputCultivationRef = useRef(null);
  const inputFertilizingRef = useRef(null);
  const inputPlantHealthRef = useRef(null);

  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isEditableImage, setEditableImage] = useState(true);
  const [diagnosticsImages, setDiagnosticsImages] = useState([]);
  const [cultivationImages, setCultivationImages] = useState([]);
  const [fertilizingImages, setFertilizingImages] = useState([]);
  const [plantHealthImages, setPlantHealthImages] = useState([]);

  const router = useRouter();
  const { addModal, removeModal } = useModal();
  const { id, fieldId, cultureId, actionId } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const {
    data: dataActions,
    error: errorActions,
    mutate: mutateActions
  } = useFetch(`/technician-actions/find/by/id/${actionId}`);

  const { type, id: userId } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
    setRoute(urlRoute(router, type));
  }, []);

  useEffect(() => {
    if (!isEmpty(dataActions))
      setEditableImage(
        ['tecnico'].includes(type) && dataActions?.technicians?.id === userId
      );

    if (!isEmpty(dataActions?.images)) {
      const { images } = dataActions;

      setDiagnosticsImages(
        images.filter(image => image?.field === 'diagnostics')
      );
      setCultivationImages(
        images.filter(image => image?.field === 'cultivation')
      );
      setFertilizingImages(
        images.filter(image => image?.field === 'fertilizing')
      );
      setPlantHealthImages(
        images.filter(image => image?.field === 'plant_health')
      );
    }
  }, [dataActions]);

  const handleSubmit = async (...{ 2: e }) => {
    setDisableButton(true);

    setAlert({
      type: 'success',
      message: 'Enviando...'
    });

    scrollTo(alertRef);

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
      (plantHealthFile.length > 0 && inputPlantHealthRef.current.error.message)
    ) {
      setAlert({
        type: 'error',
        message:
          inputDiagnosticsRef.current.error.message ||
          inputCultivationRef.current.error.message ||
          inputFertilizingRef.current.error.message ||
          inputPlantHealthRef.current.error.message
      });
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
          actionId,
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
        message: 'Imagens editadas com sucesso!'
      });

      setTimeout(() => {
        router.push(
          `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/relatorios/${actionId}/detalhes`
        );
        setDisableButton(false);
      }, 1000);
    }

    setTimeout(() => {
      setDisableButton(false);
    }, 1000);
  };

  const handleDelete = useCallback(
    async (identifier, action) => {
      removeModal();

      await TechnicianActionsService.deleteImage(identifier).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlert({ type: 'error', message: errorMessage(res) });
        } else {
          mutateActions();

          setAlert({
            type: 'success',
            message: `Imagem de ${action} foi deletada com sucesso!`
          });
        }
      });
    },
    [addModal, removeModal]
  );

  const handleDeleteModal = useCallback(
    (identifier, action) => {
      addModal({
        title: `Deletar essa Imagem?`,
        text: `Deseja realmente deletar essa imagem de ${action}`,
        confirm: true,
        onConfirm: () => handleDelete(identifier, action),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  if (error || errorCultures || errorActions)
    return <Error error={error || errorCultures || errorActions} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && fieldId !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;
  if ((data && data?.properties?.users?.id === userId) || !isEditableImage)
    return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Editar Imagens do Relatório Técnico - Agro7</title>
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
              title={`Editar Imagens do Relatório da Cultura de ${
                dataCultures?.products?.name
              } - ${dateConversor(dataActions?.created_at, false)}`}
              description={`Você está editando as imagens do relatório feito pelo técnico ${
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

                {(data && dataCultures && dataActions && (
                  <>
                    <Form ref={formRef} method="post" onSubmit={handleSubmit}>
                      <MultiStep activeStep={activeStep}>
                        <Step
                          label="Diagnóstico"
                          onClick={() => setActiveStep(1)}
                        >
                          {!isEmpty(dataActions?.diagnostics) ? (
                            <>
                              <Alert type="info">
                                Você pode inserir mais{' '}
                                {10 - diagnosticsImages.length} imagens para
                                diagnóstico da cultura
                              </Alert>
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
                                max={10 - diagnosticsImages.length}
                              />

                              <div
                                className="table-responsive"
                                style={{ marginBottom: 15 }}
                              >
                                <Table noClick>
                                  <thead>
                                    <tr>
                                      <th>Imagem</th>
                                      <th>Ações</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(!isEmpty(diagnosticsImages) &&
                                      diagnosticsImages.map((p, i) => (
                                        <tr key={p.id}>
                                          <td>
                                            Imagem {i + 1} do Diagnóstico da
                                            Cultura
                                          </td>
                                          <td
                                            onClick={e => e.stopPropagation()}
                                          >
                                            <ActionButton
                                              id={p.id}
                                              download={p?.image_url}
                                              noEdit
                                              noInfo
                                              noDelete={!isEditableImage}
                                              onDelete={() =>
                                                handleDeleteModal(
                                                  p.id,
                                                  'Diagnóstico da Cultura'
                                                )
                                              }
                                            />
                                          </td>
                                        </tr>
                                      ))) || (
                                      <tr>
                                        <td colSpan="2">
                                          Não há imagens para Diagnóstico da
                                          Cultura
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </Table>
                              </div>
                            </>
                          ) : (
                            <Alert type="info">
                              Não há Diagnóstico da Cultura inserido nesse
                              relatório.
                            </Alert>
                          )}
                        </Step>
                        <Step
                          label="Tratos Culturais"
                          onClick={() => setActiveStep(2)}
                        >
                          {!isEmpty(dataActions?.cultivation) ? (
                            <>
                              <Alert type="info">
                                Você pode inserir mais{' '}
                                {10 - cultivationImages.length} imagens para
                                diagnóstico da cultura
                              </Alert>
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
                                max={10 - cultivationImages.length}
                              />

                              <div
                                className="table-responsive"
                                style={{ marginBottom: 15 }}
                              >
                                <Table noClick>
                                  <thead>
                                    <tr>
                                      <th>Imagem</th>
                                      <th>Ações</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(!isEmpty(cultivationImages) &&
                                      cultivationImages.map((p, i) => (
                                        <tr key={p.id}>
                                          <td>
                                            Imagem {i + 1} dos Tratos Culturais
                                          </td>
                                          <td
                                            onClick={e => e.stopPropagation()}
                                          >
                                            <ActionButton
                                              id={p.id}
                                              download={p?.image_url}
                                              noEdit
                                              noInfo
                                              noDelete={!isEditableImage}
                                              onDelete={() =>
                                                handleDeleteModal(
                                                  p.id,
                                                  'Tratos Culturais'
                                                )
                                              }
                                            />
                                          </td>
                                        </tr>
                                      ))) || (
                                      <tr>
                                        <td colSpan="2">
                                          Não há imagens para Tratos Culturais
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </Table>
                              </div>
                            </>
                          ) : (
                            <Alert type="info">
                              Não há Trato Cultural inserido nesse relatório.
                            </Alert>
                          )}
                        </Step>
                        <Step label="Adubação" onClick={() => setActiveStep(3)}>
                          {!isEmpty(dataActions?.fertilizing) ? (
                            <>
                              <Alert type="info">
                                Você pode inserir mais{' '}
                                {10 - fertilizingImages.length} imagens para
                                diagnóstico da cultura
                              </Alert>
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
                                max={10 - fertilizingImages.length}
                              />
                              <div
                                className="table-responsive"
                                style={{ marginBottom: 15 }}
                              >
                                <Table noClick>
                                  <thead>
                                    <tr>
                                      <th>Imagem</th>
                                      <th>Ações</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(!isEmpty(fertilizingImages) &&
                                      fertilizingImages.map((p, i) => (
                                        <tr key={p.id}>
                                          <td>Imagem {i + 1} da Adubação</td>
                                          <td
                                            onClick={e => e.stopPropagation()}
                                          >
                                            <ActionButton
                                              id={p.id}
                                              download={p?.image_url}
                                              noEdit
                                              noInfo
                                              noDelete={!isEditableImage}
                                              onDelete={() =>
                                                handleDeleteModal(
                                                  p.id,
                                                  'Adubação'
                                                )
                                              }
                                            />
                                          </td>
                                        </tr>
                                      ))) || (
                                      <tr>
                                        <td colSpan="2">
                                          Não há imagens para Adubação
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </Table>
                              </div>
                            </>
                          ) : (
                            <Alert type="info">
                              Não há Adubação inserida nesse relatório.
                            </Alert>
                          )}
                        </Step>
                        <Step
                          label="Fitossanidade"
                          onClick={() => setActiveStep(4)}
                        >
                          {!isEmpty(dataActions?.plant_health) ? (
                            <>
                              <Alert type="info">
                                Você pode inserir mais{' '}
                                {10 - plantHealthImages.length} imagens para
                                diagnóstico da cultura
                              </Alert>
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
                                max={10 - plantHealthImages.length}
                              />

                              <div
                                className="table-responsive"
                                style={{ marginBottom: 15 }}
                              >
                                <Table noClick>
                                  <thead>
                                    <tr>
                                      <th>Imagem</th>
                                      <th>Ações</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(!isEmpty(plantHealthImages) &&
                                      plantHealthImages.map((p, i) => (
                                        <tr key={p.id}>
                                          <td>
                                            Imagem {i + 1} de Fitossanidade
                                          </td>
                                          <td
                                            onClick={e => e.stopPropagation()}
                                          >
                                            <ActionButton
                                              id={p.id}
                                              download={p?.image_url}
                                              noEdit
                                              noInfo
                                              noDelete={!isEditableImage}
                                              onDelete={() =>
                                                handleDeleteModal(
                                                  p.id,
                                                  'Fitossanidade'
                                                )
                                              }
                                            />
                                          </td>
                                        </tr>
                                      ))) || (
                                      <tr>
                                        <td colSpan="2">
                                          Não há imagens para Fitossanidade
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </Table>
                              </div>
                            </>
                          ) : (
                            <Alert type="info">
                              Não há Fitossanidade inserida nesse relatório.
                            </Alert>
                          )}
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
                              Adicionar Imagens
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

export default privateRoute(['tecnico'])(RelatoriosEdit);

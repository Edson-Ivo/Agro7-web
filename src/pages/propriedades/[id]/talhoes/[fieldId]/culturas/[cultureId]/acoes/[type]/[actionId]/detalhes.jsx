import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Form } from '@unform/web';
import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import Loader from '@/components/Loader';

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
import { dateToInput, removeTimeSeconds } from '@/helpers/date';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import errorMessage from '@/helpers/errorMessage';
import { useModal } from '@/hooks/useModal';
import Pagination from '@/components/Pagination/index';
import ActionButton from '@/components/ActionButton/index';
import Table from '@/components/Table/index';
import { Alert } from '@/components/Alert/index';
import maskString from '@/helpers/maskString';
import usersTypes from '@/helpers/usersTypes';
import downloadDocument from '@/helpers/downloadDocument';

function AcoesCulturasDetalhes() {
  const formRef = useRef(null);
  const [route, setRoute] = useState({});
  const [baseUrl, setBaseUrl] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const { addModal, removeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const {
    id,
    fieldId,
    cultureId,
    actionId,
    type: typeAction,
    pageDocs = 1
  } = router.query;

  const perPageDocs = 20;

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const { data: dataActions, error: errorActions } = useFetch(
    `/cultures-${typeAction}/find/by/id/${actionId}`
  );

  const { data: dataDocs, error: errorDocs, mutate: mutateDocs } = useFetch(
    `/cultures-${typeAction}-documents/find/by/culture-${actionsList[typeAction]?.singleValue}/${actionId}?limit=${perPageDocs}&page=${pageDocs}`
  );

  const { type } = useSelector(state => state.user);

  useEffect(() => {
    setRoute(urlRoute(router, type, [usersTypes[3], usersTypes[4]]));
  }, []);

  useEffect(() => {
    setBaseUrl(
      `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/acoes`
    );
  }, [route]);

  const handleCancel = () => {
    router.back();
  };

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await CulturesActionsService.deleteDocument(identifier, typeAction).then(
        res => {
          if (res.status >= 400 || res?.statusCode) {
            setAlertMsg({ type: 'error', message: errorMessage(res) });
          } else {
            mutateDocs();

            setAlertMsg({
              type: 'success',
              message: 'O documento foi deletado com sucesso!'
            });
          }
        }
      );

      setLoading(false);
    },
    [addModal, removeModal]
  );

  const handleDeleteModal = useCallback(
    identifier => {
      addModal({
        title: `Deletar esse Documento?`,
        text: `Deseja realmente deletar esse documento da cultura?`,
        confirm: true,
        onConfirm: () => handleDelete(identifier),
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
  if (!objectKeyExists(actionsList, typeAction)) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Detalhes da Ação na Cultura - Agro7</title>
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
              title={`Detalhes da Ação de ${actionsList[typeAction]?.label} na Cultura de ${dataCultures?.products?.name}`}
              description={`Aqui, você irá visualizar a ação ${actionsList[
                typeAction
              ]?.label.toLowerCase()} em questão da cultura de ${
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
                {(data && dataCultures && dataActions && (
                  <>
                    <MultiStep activeStep={activeStep} onlyView>
                      <Step
                        label="Informações"
                        onClick={() => setActiveStep(1)}
                      >
                        <Form
                          ref={formRef}
                          initialData={{
                            ...dataActions,
                            date: dateToInput(dataActions?.date),
                            date_start: dateToInput(dataActions?.date_start),
                            date_finish: dateToInput(dataActions?.date_finish),
                            time_start: removeTimeSeconds(
                              dataActions?.time_start
                            ),
                            time_finish: removeTimeSeconds(
                              dataActions?.time_finish
                            ),
                            supplies: dataActions?.supplies?.id,
                            value: maskString(dataActions?.value, 'money')
                          }}
                        >
                          <CulturesActionsForm
                            typeAction={typeAction}
                            dataAction={dataActions}
                            details
                          />

                          <div className="form-group buttons">
                            <div>
                              <Button type="button" onClick={handleCancel}>
                                Voltar
                              </Button>
                            </div>

                            <div>
                              <Button
                                type="button"
                                className="primary"
                                onClick={() =>
                                  router.push(
                                    `${baseUrl}/${typeAction}/${actionId}/editar`
                                  )
                                }
                              >
                                Editar
                              </Button>
                            </div>
                          </div>
                        </Form>
                      </Step>
                      <Step label="Documentos" onClick={() => setActiveStep(2)}>
                        <>
                          {actionsList[typeAction]?.documents ? (
                            <>
                              {errorDocs && (
                                <Alert type="error">
                                  Houve um erro ao tentar carregar os documentos
                                  dessa ação da cultura.
                                </Alert>
                              )}
                              {alertMsg.message && (
                                <Alert type={alertMsg.type}>
                                  {alertMsg.message}
                                </Alert>
                              )}
                              {(((data && dataDocs) || loading) && (
                                <>
                                  <Table>
                                    <thead>
                                      <tr onClick={() => router.push('/')}>
                                        <th>Nome do Documento</th>
                                        <th>Ações</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(dataDocs?.items.length > 0 &&
                                        dataDocs.items.map(d => (
                                          <tr
                                            key={d.id}
                                            onClick={() =>
                                              downloadDocument(d.url)
                                            }
                                          >
                                            <td>{d.name}</td>
                                            <td>
                                              <ActionButton
                                                id={d.id}
                                                download={d.url}
                                                path={`${baseUrl}/${typeAction}/${actionId}/documentos`}
                                                onDelete={() =>
                                                  handleDeleteModal(d.id)
                                                }
                                                noInfo
                                              />
                                            </td>
                                          </tr>
                                        ))) || (
                                        <tr>
                                          <td colSpan="2">
                                            Não há documentos para essa ação na
                                            cultura
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </Table>
                                  <Pagination
                                    url={`${route.path}/${actionId}/detalhes`}
                                    currentPage={pageDocs}
                                    itemsPerPage={perPageDocs}
                                    totalPages={dataDocs.meta.totalPages}
                                    page="pageDocs"
                                  />
                                </>
                              )) || <Loader />}
                              <div className="form-group buttons">
                                <div>
                                  <Button
                                    type="button"
                                    onClick={() => router.back()}
                                  >
                                    Voltar
                                  </Button>
                                </div>
                                <div>
                                  <Button
                                    type="button"
                                    className="primary"
                                    onClick={() =>
                                      router.push(
                                        `${baseUrl}/${typeAction}/${actionId}/documentos/cadastrar`
                                      )
                                    }
                                  >
                                    Cadastrar Documento
                                  </Button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <Alert type="info">
                              Essa ação não necessita de documentos.
                            </Alert>
                          )}
                        </>
                      </Step>
                    </MultiStep>
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

export default privateRoute()(AcoesCulturasDetalhes);

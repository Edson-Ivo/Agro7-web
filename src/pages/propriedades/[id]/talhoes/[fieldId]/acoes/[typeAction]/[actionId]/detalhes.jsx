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
import FieldsActionsService, {
  actionsList
} from '@/services/FieldsActionsService';
import objectKeyExists from '@/helpers/objectKeyExists';
import ActionsForm from '@/components/ActionsForm';
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
import InputSearch from '@/components/InputSearch/index';

function AcoesTalhaoDetalhes() {
  const formRef = useRef(null);
  const [route, setRoute] = useState({});
  const [baseUrl, setBaseUrl] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const { addModal, removeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');

  const router = useRouter();
  const { id, fieldId, actionId, typeAction, pageDocs = 1 } = router.query;

  const perPageDocs = 20;
  const requestAction = FieldsActionsService.requestAction(typeAction);

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataActions, error: errorActions } = useFetch(
    `/${requestAction}/find/by/id/${actionId}`
  );

  const { data: dataDocs, error: errorDocs, mutate: mutateDocs } = useFetch(
    `/${requestAction}-documents/find/by/${FieldsActionsService.requestSingleAction(
      typeAction
    )}/${actionId}?limit=${perPageDocs}&page=${pageDocs}&search=${search}`
  );

  const { type } = useSelector(state => state.user);

  useEffect(() => {
    setRoute(urlRoute(router, type, [usersTypes[3], usersTypes[4]]));
  }, []);

  useEffect(() => {
    if (!isEmpty(route?.path))
      setBaseUrl(`${route.path}/${id}/talhoes/${fieldId}/acoes`);
  }, [route]);

  const handleCancel = () => {
    router.back();
  };

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await FieldsActionsService.deleteDocument(identifier, typeAction).then(
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
        text: `Deseja realmente deletar esse documento do talhão?`,
        confirm: true,
        onConfirm: () => handleDelete(identifier),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  if (error || errorActions) return <Error error={error || errorActions} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;
  if (!objectKeyExists(actionsList, typeAction)) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Detalhes da Ação no Talhão {data && data?.name} - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%propriedade': data?.properties.name,
                '%talhao': data?.name
              }}
              title={`Detalhes da Ação de ${actionsList[typeAction]?.label}`}
              description={`Aqui, você irá visualizar a ação ${actionsList[
                typeAction
              ]?.label.toLowerCase()} em questão do talhão ${
                data?.name
              } da propriedade ${data?.properties?.name}.`}
              isLoading={isEmpty(data) || isEmpty(dataActions)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && dataActions && (
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
                          <ActionsForm
                            typeAction={typeAction}
                            dataAction={dataActions}
                            page="fields"
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
                                  dessa ação do talhão.
                                </Alert>
                              )}
                              {alertMsg.message && (
                                <Alert type={alertMsg.type}>
                                  {alertMsg.message}
                                </Alert>
                              )}
                              {baseUrl && (
                                <InputSearch
                                  url={`${baseUrl}/${typeAction}/${actionId}/detalhes`}
                                  onSubmitSearch={q => setSearch(q)}
                                />
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
                                            <td
                                              onClick={e => e.stopPropagation()}
                                            >
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
                                            Não há documentos para essa ação no
                                            talhão
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </Table>
                                  <Pagination
                                    url={`${baseUrl}/${typeAction}/${actionId}/detalhes`}
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

export default privateRoute()(AcoesTalhaoDetalhes);

import React, { useState, useCallback, useRef } from 'react';
import Head from 'next/head';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Loader from '@/components/Loader';
import Button from '@/components/Button';
import Table from '@/components/Table';
import { Alert } from '@/components/Alert';
import { useModal } from '@/hooks/useModal';

import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { useFetch } from '@/hooks/useFetch';
import { privateRoute } from '@/components/PrivateRoute';
import { useRouter } from 'next/router';
import ActionButton from '@/components/ActionButton/index';
import errorMessage from '@/helpers/errorMessage';
import Pagination from '@/components/Pagination/index';
import Error from '@/components/Error/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import InputSearch from '@/components/InputSearch/index';
import ActionsForm from '@/components/ActionsForm/index';
import SuppliesService, { supplies } from '@/services/SuppliesService';
import usersTypes from '@/helpers/usersTypes';
import useRewriteRoute from '@/hooks/useRewriteRoute';

function SupplyInfo() {
  const [activeStep, setActiveStep] = useState(1);
  const formRef = useRef(null);

  const router = useRouter();
  const { id, pageDocs = 1 } = router.query;

  const perPageDocs = 20;

  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const { addModal, removeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const { data, error } = useFetch(`/supplies/find/by/id/${id}`);

  const [search, setSearch] = useState('');

  const { data: dataDocs, error: errorDocs, mutate: mutateDocs } = useFetch(
    `/supplies-documents/find/by/supply/${id}?limit=${perPageDocs}&page=${pageDocs}&search=${search}`
  );

  const { path: routePath } = useRewriteRoute(router);

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await SuppliesService.deleteDocument(identifier).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
        } else {
          mutateDocs();

          setAlertMsg({
            type: 'success',
            message: 'O documento foi deletado com sucesso!'
          });
        }
      });

      setLoading(false);
    },
    [addModal, removeModal]
  );

  const handleDeleteModal = useCallback(
    identifier => {
      addModal({
        title: `Deletar esse Documento?`,
        text: `Deseja realmente deletar esse documento?`,
        confirm: true,
        onConfirm: () => handleDelete(identifier),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>Insumo - Agro9</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%insumo': data?.name
              }}
              title={`Informações do Insumo ${data?.name}`}
              description="Aqui, você irá ver informações detalhadas do insumo em questão"
              isLoading={isEmpty(data)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && (
                  <>
                    <MultiStep activeStep={activeStep} onlyView>
                      <Step
                        label="Informações"
                        onClick={() => setActiveStep(1)}
                      >
                        <Form
                          ref={formRef}
                          initialData={{
                            ...data
                          }}
                        >
                          <ActionsForm
                            typeAction="supplies"
                            dataAction={data}
                            details
                          />

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
                                  router.push(`${routePath}/${id}/editar`)
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
                          {supplies?.documents ? (
                            <>
                              {errorDocs && (
                                <Alert type="error">
                                  Houve um erro ao tentar carregar os documentos
                                  dessa ação da propriedade.
                                </Alert>
                              )}
                              {alertMsg.message && (
                                <Alert type={alertMsg.type}>
                                  {alertMsg.message}
                                </Alert>
                              )}

                              {!isEmpty(routePath) && (
                                <InputSearch
                                  url={`${routePath}/${id}/detalhes`}
                                  onSubmitSearch={q => setSearch(q)}
                                />
                              )}

                              {(((data && dataDocs) || loading) && (
                                <>
                                  <Table>
                                    <thead>
                                      <tr>
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
                                              router.push(
                                                `${routePath}/${id}/documentos/${d.id}/detalhes`
                                              )
                                            }
                                          >
                                            <td>{d.name}</td>
                                            <td
                                              onClick={e => e.stopPropagation()}
                                            >
                                              <ActionButton
                                                id={d.id}
                                                path={`${routePath}/${id}/documentos`}
                                                onDelete={() =>
                                                  handleDeleteModal(d.id)
                                                }
                                              />
                                            </td>
                                          </tr>
                                        ))) || (
                                        <tr>
                                          <td colSpan="2">
                                            Não há documentos para essa ação na
                                            propriedade
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </Table>
                                  <Pagination
                                    url={`${routePath}/${id}/detalhes`}
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
                                        `${routePath}/${id}/documentos/cadastrar`
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

export default privateRoute([
  usersTypes[0],
  usersTypes[1],
  usersTypes[2],
  usersTypes[4]
])(SupplyInfo);

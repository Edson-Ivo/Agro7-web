import React, { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Form } from '@unform/web';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';

import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import { useFetch } from '@/hooks/useFetch';
import Error from '@/components/Error/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

import { dateConversor } from '@/helpers/date';
import Table from '@/components/Table/index';
import ActionButton from '@/components/ActionButton/index';
import Pagination from '@/components/Pagination/index';
import Loader from '@/components/Loader/index';
import errorMessage from '@/helpers/errorMessage';
import SalesService from '@/services/SalesService';
import { useModal } from '@/hooks/useModal';
import truncate from '@/helpers/truncate';
import useRewriteRoute from '@/hooks/useRewriteRoute';
import maskString from '@/helpers/maskString';
import downloadDocument from '@/helpers/downloadDocument';
import InputSearch from '@/components/InputSearch/index';

function VendasTransportadorasDetalhes() {
  const formRef = useRef(null);
  const router = useRouter();

  const { path: routePath } = useRewriteRoute(router);

  const perPageDocs = 20;
  const perPageVehicles = 20;
  const { pageDocs = 1, pageVehicles = 1 } = router.query;

  const [alert, setAlert] = useState({ type: '', message: '' });
  const [activeStep, setActiveStep] = useState(1);

  const { id } = router.query;

  const [search, setSearch] = useState('');

  const { data, error } = useFetch(`/transporters/find/by/id/${id}`);
  const { data: dataDocs, error: errorDocs, mutate: mutateDocs } = useFetch(
    `/transporters-documents/find/by/transporter/${id}?limit=${perPageDocs}&page=${pageDocs}&search=${search}`
  );
  const { data: dataVehicles, error: errorVehicles } = useFetch(
    `/transporters-vehicles/find/by/transporter/${id}?limit=${perPageVehicles}&page=${pageVehicles}`
  );

  const { addModal, removeModal } = useModal();
  const handleDelete = useCallback(
    async identifier => {
      removeModal();

      await SalesService.deleteTransporterDocument(identifier).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlert({ type: 'error', message: errorMessage(res) });
        } else {
          mutateDocs();

          setAlert({
            type: 'success',
            message: 'Documento da transportadora deletado com sucesso!'
          });
        }
      });
    },
    [addModal, removeModal]
  );

  const handleDeleteModal = useCallback(
    identifier => {
      addModal({
        title: 'Deletar Documento',
        text: 'Deseja realmente deletar este documento da transportadora?',
        confirm: true,
        onConfirm: () => handleDelete(identifier),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setActiveStep(1);
  }, []);

  const handleChangeActiveStep = step => {
    setActiveStep(step);
  };

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>Transportadora {data && data?.name} - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%transportadora': data?.name
              }}
              title={`Transportadora ${data?.name}`}
              description={`Aqui, você irá ver os dados da sua transportadora ${
                data?.name
              } cadastrada no dia ${dateConversor(data?.created_at, false)}.`}
              isLoading={isEmpty(data)}
            >
              <div className="buttons__container">
                <Link href={`${routePath}/transportadoras/${id}/relatorio`}>
                  <Button className="primary">
                    <FontAwesomeIcon icon={faFileAlt} /> Relatório
                  </Button>
                </Link>
              </div>
            </SectionHeaderContent>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                {data && (
                  <>
                    <Form
                      ref={formRef}
                      initialData={{
                        ...data,
                        document: maskString(data?.document, 'document') || '',
                        phone: maskString(data?.phone, 'phone') || ''
                      }}
                    >
                      <MultiStep activeStep={activeStep} onlyView>
                        <Step
                          label="Transportadora"
                          onClick={() => handleChangeActiveStep(1)}
                        >
                          <Input
                            type="text"
                            label="Nome"
                            name="name"
                            disabled
                          />
                          <Input
                            type="text"
                            label="Documento (CPF ou CNPJ)"
                            name="document"
                            mask="cpf_cnpj"
                            maxLength="18"
                            disabled
                          />
                          <Input
                            type="text"
                            label="Número Telefone"
                            name="phone"
                            mask="phone"
                            maxLength={15}
                            disabled
                          />
                        </Step>
                        <Step
                          label="Documentos"
                          onClick={() => handleChangeActiveStep(2)}
                        >
                          {errorDocs && (
                            <Alert type="error">
                              Houve um erro ao tentar carregar os documentos
                              dessa transportadora.
                            </Alert>
                          )}
                          <InputSearch
                            url={`${routePath}/transportadoras/${id}/detalhes`}
                            onSubmitSearch={q => setSearch(q)}
                          />
                          {(data && dataDocs && (
                            <>
                              <Table>
                                <thead>
                                  <tr onClick={() => router.push('/')}>
                                    <th>Nome do Documento</th>
                                    <th>Ações</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(!isEmpty(dataDocs?.items) &&
                                    dataDocs.items.map(d => (
                                      <tr
                                        key={d?.id.toString()}
                                        onClick={() => downloadDocument(d.url)}
                                      >
                                        <td>{d?.name}</td>
                                        <td onClick={e => e.stopPropagation()}>
                                          <ActionButton
                                            id={d?.id}
                                            download={d?.url}
                                            onDelete={() =>
                                              handleDeleteModal(d.id)
                                            }
                                            noEdit
                                            noInfo
                                          />
                                        </td>
                                      </tr>
                                    ))) || (
                                    <tr>
                                      <td colSpan="2">
                                        Não há documentos para essa
                                        transportadora
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </Table>
                              <Pagination
                                url={`${routePath}/transportadoras/${id}/detalhes`}
                                currentPage={pageDocs}
                                itemsPerPage={perPageDocs}
                                totalPages={dataDocs?.meta?.totalPages}
                                page="pageDocs"
                              />
                            </>
                          )) || <Loader />}
                          <div className="form-group buttons">
                            <div>
                              <Button
                                type="button"
                                className="primary"
                                onClick={() =>
                                  router.push(
                                    `${routePath}/transportadoras/${id}/documentos/cadastrar`
                                  )
                                }
                              >
                                Cadastrar Documento
                              </Button>
                            </div>
                          </div>
                        </Step>
                        <Step
                          label="Veículos"
                          onClick={() => handleChangeActiveStep(3)}
                        >
                          {errorVehicles && (
                            <Alert type="error">
                              Houve um erro ao tentar carregar os veiculos dessa
                              transportadora.
                            </Alert>
                          )}
                          {(data && dataVehicles && (
                            <>
                              <Table>
                                <thead>
                                  <tr onClick={() => router.push('/')}>
                                    <th>Nome do Veículo</th>
                                    <th>Placa</th>
                                    <th>Descrição</th>
                                    <th>Ações</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(!isEmpty(dataVehicles?.items) &&
                                    dataVehicles.items.map(d => (
                                      <tr
                                        key={d?.id.toString()}
                                        onClick={() =>
                                          router.push(
                                            `${routePath}/transportadoras/${id}/veiculos/${d?.id}/detalhes`
                                          )
                                        }
                                      >
                                        <td>{d?.name}</td>
                                        <td>{d?.plate}</td>
                                        <td>{truncate(d.description, 40)}</td>
                                        <td onClick={e => e.stopPropagation()}>
                                          <ActionButton
                                            id={d?.id}
                                            url={`${routePath}/transportadoras/${id}/veiculos/${d?.id}/detalhes`}
                                            noDelete
                                            noEdit
                                          />
                                        </td>
                                      </tr>
                                    ))) || (
                                    <tr>
                                      <td colSpan="4">
                                        Não há veículos para essa transportadora
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </Table>
                              <Pagination
                                url={`${routePath}/transportadoras/${id}/detalhes`}
                                currentPage={pageVehicles}
                                itemsPerPage={perPageVehicles}
                                totalPages={dataVehicles?.meta?.totalPages}
                                page="pageVehicles"
                              />
                            </>
                          )) || <Loader />}
                        </Step>
                      </MultiStep>
                    </Form>
                  </>
                )}
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(VendasTransportadorasDetalhes);

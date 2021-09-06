import React, { useState, useCallback, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Form } from '@unform/web';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack, faUserFriends } from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import { MapActionGetLatLng } from '@/components/MapApp';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Loader from '@/components/Loader';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
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
import capitalize from '@/helpers/capitalize';
import DocumentsService from '@/services/DocumentsService';
import Pagination from '@/components/Pagination/index';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import maskString from '@/helpers/maskString';

function PropertieInfo() {
  const [activeStep, setActiveStep] = useState(1);
  const formRef = useRef(null);

  const router = useRouter();
  const { id } = router.query;

  const perPageDocs = 20;

  const { pageDocs = 1 } = router.query;

  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const { addModal, removeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [loadingWillAccess, setLoadingWillAccess] = useState(false);
  const [willAccess, setWillAccess] = useState(false);

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  const { data: dataDocs, error: errorDocs, mutate: mutateDocs } = useFetch(
    `/properties-documents/find/property/${id}?limit=${perPageDocs}&page=${pageDocs}`
  );
  const { data: dataTypeOwner } = useFetch('/properties/find/all/types-owner');

  const { data: dataTypeDimension } = useFetch(
    '/properties/find/all/types-dimension'
  );

  const { id: userId, type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  useEffect(() => {
    setRoute(urlRoute(router, type));
  }, []);

  useEffect(() => {
    if (data) {
      setWillAccess(!(type === 'tecnico' && data?.users?.id !== userId));
      setLoadingWillAccess(true);
    }
  }, [data]);

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await DocumentsService.delete(identifier).then(res => {
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
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Propriedade - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%propriedade': data?.name
              }}
              title={`Informações da propriedade ${data?.name}`}
              description="Aqui você irá ver informações detalhadas da propriedade em
                questão"
              isLoading={isEmpty(data)}
            >
              {loadingWillAccess && (
                <div className="buttons__container">
                  <Link href={`${route.path}/${id}/talhoes/`}>
                    <Button className="primary">
                      <FontAwesomeIcon icon={faThumbtack} /> Talhões
                    </Button>
                  </Link>
                  {willAccess && (
                    <Link href={`${route.path}/${id}/tecnicos/`}>
                      <Button className="primary">
                        <FontAwesomeIcon icon={faUserFriends} /> Técnicos
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </SectionHeaderContent>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && dataTypeOwner && dataTypeDimension && (
                  <>
                    <MultiStep activeStep={activeStep} onlyView>
                      <Step
                        label="Informações"
                        onClick={() => setActiveStep(1)}
                      >
                        <Form
                          ref={formRef}
                          initialData={{
                            ...data,
                            addresses: {
                              ...data?.addresses,
                              postcode:
                                maskString(
                                  data?.addresses?.postcode,
                                  'postcode'
                                ) || ''
                            }
                          }}
                        >
                          <div className="form-group">
                            <div>
                              <Input
                                type="text"
                                label="Nome da propriedade"
                                name="name"
                                disabled
                              />
                            </div>
                            <div>
                              <Select
                                options={dataTypeOwner?.typesOwner.map(
                                  owner => ({
                                    value: owner,
                                    label: capitalize(owner)
                                  })
                                )}
                                label="Quem é você para esta propriedade?"
                                name="type_owner"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                label="Área"
                                name="area"
                                disabled
                              />
                            </div>
                            <div>
                              <Select
                                options={dataTypeDimension?.typesDimension.map(
                                  dimension => ({
                                    value: dimension,
                                    label: dimension
                                  })
                                )}
                                label="Unidade de medida"
                                name="type_dimension"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="text"
                                label="CEP"
                                name="addresses.postcode"
                                mask="cep"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="text"
                                label="Estado"
                                name="addresses.state"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="text"
                                label="Cidade"
                                name="addresses.city"
                                disabled
                              />
                            </div>
                          </div>
                          <div>
                            <Input
                              type="text"
                              label="Logradouro"
                              name="addresses.locality"
                              disabled
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              label="Acesso"
                              name="addresses.access"
                              disabled
                            />
                          </div>

                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                label="Latitude"
                                name="coordinates.latitude"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                label="Longitude"
                                name="coordinates.longitude"
                                disabled
                              />
                            </div>
                          </div>
                          <div style={{ marginBottom: '20px' }}>
                            <MapActionGetLatLng
                              positions={[
                                data.coordinates.latitude,
                                data.coordinates.longitude
                              ]}
                            />
                          </div>
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
                                  router.push(`${route.path}/${id}/editar`)
                                }
                              >
                                Editar
                              </Button>
                            </div>
                          </div>
                        </Form>
                      </Step>
                      <Step label="Documentos" onClick={() => setActiveStep(2)}>
                        {errorDocs && (
                          <Alert type="error">
                            Houve um erro ao tentar carregar os documentos dessa
                            propriedade.
                          </Alert>
                        )}
                        {alertMsg.message && (
                          <Alert type={alertMsg.type}>{alertMsg.message}</Alert>
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
                                    <tr key={d.id}>
                                      <td>{d.name}</td>
                                      <td>
                                        <ActionButton
                                          id={d.id}
                                          download={d.url}
                                          path={`${route.path}/${id}/documentos`}
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
                                      Não há documentos para essa propriedade
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                            <Pagination
                              url={`${route.path}/${id}/detalhes`}
                              currentPage={pageDocs}
                              itemsPerPage={perPageDocs}
                              totalPages={dataDocs.meta.totalPages}
                              page="pageDocs"
                            />
                          </>
                        )) || <Loader />}
                        <div className="form-group buttons">
                          <div>
                            <Button type="button" onClick={() => router.back()}>
                              Voltar
                            </Button>
                          </div>
                          <div>
                            <Button
                              type="button"
                              className="primary"
                              onClick={() =>
                                router.push(
                                  `${route.path}/${id}/documentos/cadastrar`
                                )
                              }
                            >
                              Adicionar Documento
                            </Button>
                          </div>
                        </div>
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

export default privateRoute()(PropertieInfo);

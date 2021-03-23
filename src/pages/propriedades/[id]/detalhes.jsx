import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import { MapActionGetLatLng } from '@/components/MapApp';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
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

function PropertieInfo() {
  const [activeStep, setActiveStep] = useState(1);

  const router = useRouter();
  const { id } = router.query;

  const perPageDocs = 20;

  const { pageDocs = 1 } = router.query;

  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const { addModal, removeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  const { data: dataDocs, error: errorDocs, mutate: mutateDocs } = useFetch(
    `/documents/find/property/${id}?limit=${perPageDocs}&page=${pageDocs}`
  );
  const { data: dataTypeOwner, error: errorTypeOwner } = useFetch(
    '/properties/find/all/types-owner'
  );

  const { data: dataTypeDimension, error: errorTypeDimension } = useFetch(
    '/properties/find/all/types-dimension'
  );

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await DocumentsService.delete(identifier).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlertMsg(errorMessage(res));
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

  return (
    <>
      {error && router.back()}
      <Head>
        <title>Propriedade - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              <Breadcrumb
                path={[
                  { route: '/', name: 'Home' },
                  { route: '/propriedades', name: 'Propriedades' }
                ]}
              />
              <h2>Informações da propriedade {data && `(${data.name})`}</h2>
              <p>
                Aqui você irá ver informações detalhadas da propriedade em
                questão
              </p>
              <Link href={`/propriedades/${id}/talhoes/`}>
                <Button className="primary">
                  <FontAwesomeIcon icon={faThumbtack} /> Ver Talhões
                </Button>
              </Link>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && dataTypeOwner && dataTypeDimension && (
                  <>
                    <MultiStep activeStep={activeStep}>
                      <Step
                        label="Informações"
                        onClick={() => setActiveStep(1)}
                      >
                        <div className="form-group">
                          <div>
                            <Input
                              type="text"
                              label="Nome da propriedade"
                              name="name"
                              initialValue={data.name}
                              disabled
                            />
                          </div>
                          <div>
                            <Select
                              options={dataTypeOwner?.typesOwner.map(owner => ({
                                value: owner,
                                label: capitalize(owner)
                              }))}
                              label="Quem é você para esta propriedade?"
                              value={data.type_owner}
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
                              initialValue={data.area}
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
                              value={data.type_dimension}
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
                              name="postcode"
                              initialValue={data.addresses.postcode}
                              mask="cep"
                              disabled
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              label="Estado"
                              name="state"
                              initialValue={data.addresses.state}
                              disabled
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              label="Cidade"
                              name="city"
                              initialValue={data.addresses.city}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="text"
                              label="Bairro"
                              name="neighborhood"
                              initialValue={data.addresses.neighborhood}
                              disabled
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              label="Rua"
                              name="street"
                              initialValue={data.addresses.street}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="text"
                              label="Número"
                              name="number"
                              initialValue={data.addresses.number}
                              disabled
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              label="Complementos"
                              name="complements"
                              initialValue={data.addresses.complements || ''}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              label="Latitude"
                              name="latitude"
                              initialValue={data.coordinates.latitude}
                              disabled
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              label="Longitude"
                              name="longitude"
                              initialValue={data.coordinates.longitude}
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
                            <Button onClick={() => router.back()}>
                              Voltar
                            </Button>
                          </div>
                          <div>
                            <Button
                              className="primary"
                              onClick={() =>
                                router.push(`/propriedades/${id}/editar`)
                              }
                            >
                              Editar
                            </Button>
                          </div>
                        </div>
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
                                          path={`/propriedades/${id}/documentos`}
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
                              url={`/propriedades/${id}/detalhes`}
                              currentPage={pageDocs}
                              itemsPerPage={perPageDocs}
                              totalPages={dataDocs.totalPages}
                              page="pageDocs"
                            />
                          </>
                        )) || <Loader />}
                        <div className="form-group buttons">
                          <div>
                            <Button onClick={() => router.back()}>
                              Voltar
                            </Button>
                          </div>
                          <div>
                            <Button
                              className="primary"
                              onClick={() =>
                                router.push(
                                  `/propriedades/${id}/documentos/cadastrar`
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

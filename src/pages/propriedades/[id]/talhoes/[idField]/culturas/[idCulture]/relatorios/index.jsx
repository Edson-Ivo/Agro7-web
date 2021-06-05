import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Loader from '@/components/Loader';
import Button from '@/components/Button';
import Table from '@/components/Table';
import { Alert } from '@/components/Alert';
import { useModal } from '@/hooks/useModal';

import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { useFetch } from '@/hooks/useFetch';
import { privateRoute } from '@/components/PrivateRoute';
import { useRouter } from 'next/router';
import ActionButton from '@/components/ActionButton';
import errorMessage from '@/helpers/errorMessage';
import isEmpty from '@/helpers/isEmpty';
import Pagination from '@/components/Pagination';
import TechnicianActionsService from '@/services/TechnicianActionsService';
import truncate from '@/helpers/truncate';
import { dateConversor } from '@/helpers/date';
import Error from '@/components/Error/index';
import urlRoute from '@/helpers/urlRoute';

function Relatorios() {
  const [willCreate, setWillCreate] = useState(false);
  const router = useRouter();
  const { type, id: userId } = useSelector(state => state.user);

  const { id, idField, idCulture, page = 1 } = router.query;

  const perPage = 10;

  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const { addModal, removeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const { data, error } = useFetch(`/fields/find/by/id/${idField}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${idCulture}`
  );

  const {
    data: dataTechActions,
    error: errorTechActions,
    mutate: mutateTechActions
  } = useFetch(
    `/technician-actions/find/by/culture/${idCulture}?limit=${perPage}&page=${page}`
  );

  const [route, setRoute] = useState({});
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setRoute(urlRoute(router, type));
  }, []);

  useEffect(() => {
    setBaseUrl(
      `${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}/relatorios`
    );
  }, [route]);

  useEffect(() => {
    if (data)
      setWillCreate(
        ['tecnico', 'administrador'].includes(type) &&
          data?.properties?.users?.id !== userId
      );
  }, [data]);

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await TechnicianActionsService.delete(identifier).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
        } else {
          mutateTechActions();

          setAlertMsg({
            type: 'success',
            message: 'O relatório técnico foi deletado com sucesso!'
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
        title: `Deletar esse Relatório?`,
        text: `Deseja realmente deletar esse relatório?`,
        confirm: true,
        onConfirm: () => handleDelete(identifier),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  if (error || errorCultures || errorTechActions)
    return <Error error={error || errorCultures || errorTechActions} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && idField !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>
          Relatório Técnico da Cultura de {dataCultures?.products.name} do
          Talhão {data && data.name} - Agro7
        </title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              {data && dataCultures && (
                <Breadcrumb
                  path={[
                    { route: '/', name: 'Home' },
                    {
                      route: '/tecnico',
                      name: 'Painel Técnico',
                      active: type === 'tecnico' && route?.permission === type
                    },
                    {
                      route: '/admin',
                      name: 'Painel Administrativo',
                      active:
                        type === 'administrador' && route?.permission === type
                    },
                    { route: `${route.path}`, name: 'Propriedades' },
                    {
                      route: `${route.path}/${id}/detalhes`,
                      name: `${data?.properties.name}`
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
                      name: `${dataCultures?.products.name}`
                    },
                    {
                      route: `${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}/relatorios`,
                      name: `Relatórios`
                    }
                  ]}
                />
              )}
              <h2>
                Relatório Técnico da Cultura de {dataCultures?.products.name} do
                Talhão {data && data.name}
              </h2>
              <p>
                Aqui você irá ver os relatórios do técnico da cultura de{' '}
                {dataCultures?.products.name} do talhão{' '}
                {`${data?.name} da propriedade ${data?.properties.name}`}.
              </p>
              {willCreate && (
                <Link href={`${baseUrl}/cadastrar`}>
                  <Button className="primary">
                    <FontAwesomeIcon icon={faPlus} /> Adicionar Relatório
                  </Button>
                </Link>
              )}
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                <>
                  {alertMsg.message && (
                    <Alert type={alertMsg.type}>{alertMsg.message}</Alert>
                  )}
                  {(((data && dataCultures && dataTechActions) || loading) && (
                    <>
                      <div className="table-responsive">
                        <Table>
                          <thead>
                            <tr>
                              <th>Data</th>
                              <th>Concluído</th>
                              <th>Diagnóstico</th>
                              <th>Tratos Culturais</th>
                              <th>Adubação</th>
                              <th>Fitossanidade</th>
                              <th>Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(!isEmpty(dataTechActions?.items) &&
                              dataTechActions.items.map(d => (
                                <tr
                                  key={d.id}
                                  onClick={() =>
                                    router.push(`${baseUrl}/${d.id}/detalhes`)
                                  }
                                >
                                  <td>{dateConversor(d?.created_at, false)}</td>
                                  <td>{d?.concluded ? 'Sim' : 'Não'}</td>
                                  <td>{truncate(d?.diagnostics, 30)}</td>
                                  <td>{truncate(d?.cultivation, 30)}</td>
                                  <td>{truncate(d?.fertilizing, 30)}</td>
                                  <td>{truncate(d?.cultivation, 30)}</td>
                                  <td onClick={e => e.stopPropagation()}>
                                    <ActionButton
                                      id={d.id}
                                      path={baseUrl}
                                      noEdit
                                      noDelete={!willCreate}
                                      onDelete={() => handleDeleteModal(d.id)}
                                    />
                                  </td>
                                </tr>
                              ))) || (
                              <tr>
                                <td colSpan="7">
                                  Não há relatórios registrados nessa cultura
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                      <Pagination
                        url={`${baseUrl}`}
                        currentPage={page}
                        itemsPerPage={perPage}
                        totalPages={dataTechActions.meta.totalPages}
                      />
                    </>
                  )) || <Loader />}
                </>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(Relatorios);

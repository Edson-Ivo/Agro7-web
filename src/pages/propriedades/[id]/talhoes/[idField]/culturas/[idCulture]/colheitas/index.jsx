import React, { useState, useCallback, useEffect } from 'react';
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
import HarvestsService from '@/services/HarvestsService';
import { dateConversor } from '@/helpers/date';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';

function Colheitas() {
  const router = useRouter();
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
    data: dataHarvests,
    error: errorHarvests,
    mutate: mutateHarvests
  } = useFetch(
    `/harvests/find/by/culture/${idCulture}?limit=${perPage}&page=${page}`
  );

  const { type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setRoute(urlRoute(router, type));
  }, []);

  useEffect(() => {
    setBaseUrl(
      `${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}/colheitas`
    );
  }, [route]);

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await HarvestsService.delete(identifier).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
        } else {
          mutateHarvests();

          setAlertMsg({
            type: 'success',
            message: 'A colheita foi deletada com sucesso!'
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
        title: `Deletar essa Colheita?`,
        text: `Deseja realmente deletar essa colheita?`,
        confirm: true,
        onConfirm: () => handleDelete(identifier),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  if (error || errorCultures || errorHarvests)
    return <Error error={error || errorCultures || errorHarvests} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && idField !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>
          Colheitas da Cultura de {dataCultures?.products.name} do Talhão{' '}
          {data && data.name} - Agro7
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
                      route: `${route.path}/${id}/talhoes/${idField}/culturas/${idCulture}/colheitas`,
                      name: `Colheitas`
                    }
                  ]}
                />
              )}
              <h2>
                Colheitas da Cultura de {dataCultures?.products.name} do Talhão{' '}
                {data && data.name}
              </h2>
              <p>
                Aqui você irá ver as colheitas da cultura de{' '}
                {dataCultures?.products.name} do talhão{' '}
                {`${data?.name} da propriedade ${data?.properties.name}`}.
              </p>
              <Link href={`${baseUrl}/cadastrar`}>
                <Button className="primary">
                  <FontAwesomeIcon icon={faPlus} /> Registrar Colheita
                </Button>
              </Link>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                <>
                  {alertMsg.message && (
                    <Alert type={alertMsg.type}>{alertMsg.message}</Alert>
                  )}
                  {(((data && dataCultures && dataHarvests) || loading) && (
                    <>
                      <div className="table-responsive">
                        <Table>
                          <thead>
                            <tr>
                              <th>Data</th>
                              <th>Quantidade</th>
                              <th>Previsão</th>
                              <th>Quantidade Prevista</th>
                              <th>Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(!isEmpty(dataHarvests?.items) &&
                              dataHarvests.items.map(d => (
                                <tr key={d.id}>
                                  <td>{dateConversor(d?.date, false)}</td>
                                  <td>{`${d?.quantity}kg`}</td>
                                  <td>{dateConversor(d?.forecast, false)}</td>
                                  <td>{`${d?.quantity_forecast}kg`}</td>
                                  <td>
                                    <ActionButton
                                      id={d.id}
                                      path={baseUrl}
                                      noInfo
                                      onDelete={() => handleDeleteModal(d.id)}
                                    />
                                  </td>
                                </tr>
                              ))) || (
                              <tr>
                                <td colSpan="5">
                                  Não há colheitas registradas nessa cultura
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
                        totalPages={dataHarvests.meta.totalPages}
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

export default privateRoute()(Colheitas);

import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

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
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import InputSearch from '@/components/InputSearch/index';
import usersTypes from '@/helpers/usersTypes';
import objectToQuery from '@/helpers/objectToQuery';
import useRewriteRoute from '@/hooks/useRewriteRoute';

function Relatorios() {
  const [willCreate, setWillCreate] = useState(false);
  const router = useRouter();
  const { type, id: userId } = useSelector(state => state.user);

  const { id, fieldId, cultureId, page = 1 } = router.query;

  const perPage = 10;

  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const { addModal, removeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    date_start: '',
    date_finish: '',
    concluded: ''
  });

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const {
    data: dataTechActions,
    error: errorTechActions,
    mutate: mutateTechActions
  } = useFetch(
    `/technician-actions/find/by/culture/${cultureId}?limit=${perPage}&page=${page}&search=${search}&${objectToQuery(
      filters
    )}`
  );

  const route = useRewriteRoute(router);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (!isEmpty(route?.path))
      setBaseUrl(
        `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/relatorios`
      );
  }, [route]);

  useEffect(() => {
    if (data) {
      setWillCreate(
        [usersTypes[3], usersTypes[4], usersTypes[0]].includes(type) &&
          data?.properties?.users?.id !== userId
      );
    }
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
  if (dataCultures && fieldId !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>
          Relatório Técnico da Cultura de {dataCultures?.products.name} do
          Talhão {data && data.name} - Agro9
        </title>
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
              title={`Relatório Técnico da Cultura de ${dataCultures?.products?.name} do Talhão ${data?.name}`}
              description={`Aqui, você irá ver os relatórios do técnico da cultura de ${dataCultures?.products?.name} do talhão ${data?.name} da propriedade ${data?.properties?.name}.`}
              isLoading={isEmpty(data) || isEmpty(dataCultures)}
            >
              {willCreate && (
                <Link href={`${baseUrl}/cadastrar`}>
                  <Button className="primary">
                    <FontAwesomeIcon icon={faPlus} /> Cadastrar Relatório
                  </Button>
                </Link>
              )}
            </SectionHeaderContent>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                <>
                  {alertMsg.message && (
                    <Alert type={alertMsg.type}>{alertMsg.message}</Alert>
                  )}
                  {!isEmpty(baseUrl) && (
                    <InputSearch
                      url={`${baseUrl}`}
                      filters={{
                        date: true,
                        selects: {
                          concluded: {
                            options: [
                              {
                                value: 'all',
                                label: 'Todos'
                              },
                              {
                                value: '1',
                                label: 'Sim'
                              },
                              {
                                value: '0',
                                label: 'Não'
                              }
                            ],
                            label: 'Concluído',
                            defaultValue: 'all'
                          }
                        }
                      }}
                      onFilterChange={f => setFilters({ ...f })}
                      onSubmitSearch={q => setSearch(q)}
                    />
                  )}
                  {(((data && dataCultures && dataTechActions) || loading) && (
                    <>
                      <div className="table-responsive">
                        <Table>
                          <thead>
                            <tr>
                              <th>Técnico</th>
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
                                  <td>
                                    {!isEmpty(d?.technicians)
                                      ? d?.technicians?.name
                                      : 'Usuário deletado'}
                                  </td>
                                  <td>{dateConversor(d?.created_at, false)}</td>
                                  <td>{d?.concluded ? 'Sim' : 'Não'}</td>
                                  <td>
                                    {truncate(d?.diagnostics, 30) ||
                                      'Não informado'}
                                  </td>
                                  <td>
                                    {truncate(d?.cultivation, 30) ||
                                      'Não informado'}
                                  </td>
                                  <td>
                                    {truncate(d?.fertilizing, 30) ||
                                      'Não informado'}
                                  </td>
                                  <td>
                                    {truncate(d?.plant_health, 30) ||
                                      'Não informado'}
                                  </td>
                                  <td onClick={e => e.stopPropagation()}>
                                    <ActionButton
                                      id={d.id}
                                      path={baseUrl}
                                      noEdit
                                      noDelete={
                                        (type !== usersTypes[0] &&
                                          !willCreate) ||
                                        !(d?.technicians?.id === userId)
                                      }
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

import React, { useState, useCallback, useEffect } from 'react';
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
import ActionButton from '@/components/ActionButton/index';
import errorMessage from '@/helpers/errorMessage';
import isEmpty from '@/helpers/isEmpty';
import Pagination from '@/components/Pagination/index';
import CulturesService from '@/services/CulturesService';
import Error from '@/components/Error/index';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import { dateConversor } from '@/helpers/date';
import maskString from '@/helpers/maskString';
import useUserAccess from '@/hooks/useUserAccess';
import InputSearch from '@/components/InputSearch/index';
import objectToQuery from '@/helpers/objectToQuery';
import useRewriteRoute from '@/hooks/useRewriteRoute';

function Culturas() {
  const router = useRouter();
  const { id, fieldId, page = 1 } = router.query;

  const perPage = 10;

  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const { addModal, removeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const route = useRewriteRoute(router);
  const [baseUrl, setBaseUrl] = useState('');

  const [userAccess, loadingUserAccess] = useUserAccess(
    route,
    data?.properties?.users?.id
  );

  useEffect(() => {
    if (!isEmpty(route?.path))
      setBaseUrl(`${route.path}/${id}/talhoes/${fieldId}/culturas`);
  }, [route]);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    date_start: '',
    data_finish: ''
  });

  const {
    data: dataCultures,
    error: errorCultures,
    mutate: mutateCultures
  } = useFetch(
    `/cultures/find/by/field/${fieldId}?limit=${perPage}&page=${page}&search=${search}&${objectToQuery(
      filters
    )}`
  );

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await CulturesService.delete(identifier).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
        } else {
          mutateCultures();

          setAlertMsg({
            type: 'success',
            message: 'A cultura foi deletada com sucesso!'
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
        title: `Deletar essa Cultura?`,
        text: `Deseja realmente deletar essa cultura?`,
        confirm: true,
        onConfirm: () => handleDelete(identifier),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  if (error || errorCultures) return <Error error={error || errorCultures} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Culturas do Talhão {data && data.name} - Agro7</title>
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
              title={`Culturas do Talhão ${data?.name}`}
              description={`Aqui, você irá ver as culturas do talhão ${data?.name} da propriedade ${data?.properties?.name}.`}
              isLoading={isEmpty(data) || loadingUserAccess}
            >
              {userAccess && (
                <Link href={`${baseUrl}/cadastrar`}>
                  <Button className="primary">
                    <FontAwesomeIcon icon={faPlus} /> Nova Cultura
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
                        date: true
                      }}
                      onFilterChange={f => setFilters({ ...f })}
                      onSubmitSearch={q => setSearch(q)}
                    />
                  )}
                  {(((data && dataCultures && !loadingUserAccess) ||
                    loading) && (
                    <>
                      <div className="table-responsive">
                        <Table>
                          <thead>
                            <tr>
                              <th>Cultura</th>
                              <th>Área</th>
                              <th>Data</th>
                              <th>Data de Término</th>
                              <th>Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(!isEmpty(dataCultures?.items) &&
                              dataCultures.items.map(d => (
                                <tr
                                  key={d.id}
                                  onClick={() =>
                                    router.push(`${baseUrl}/${d.id}/detalhes`)
                                  }
                                >
                                  <td>{d?.products?.name}</td>
                                  <td>{`${maskString(
                                    d?.area,
                                    'area-in-table'
                                  )}${d.type_dimension}`}</td>
                                  <td>{dateConversor(d?.date_start, false)}</td>
                                  <td>
                                    {d?.date_finish
                                      ? dateConversor(d?.date_finish, false)
                                      : 'Não finalizada'}
                                  </td>
                                  <td onClick={e => e.stopPropagation()}>
                                    <ActionButton
                                      id={d.id}
                                      path={baseUrl}
                                      onlyView={!userAccess}
                                      onDelete={() => handleDeleteModal(d.id)}
                                    />
                                  </td>
                                </tr>
                              ))) || (
                              <tr>
                                <td colSpan="5">
                                  Não há culturas nesse talhão
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
                        totalPages={dataCultures.meta.totalPages}
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

export default privateRoute()(Culturas);

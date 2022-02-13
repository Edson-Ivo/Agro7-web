import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Loader from '@/components/Loader';
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
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import PropertiesService from '@/services/PropertiesService';
import { dateConversor } from '@/helpers/date';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import usersTypes from '@/helpers/usersTypes';
import InputSearch from '@/components/InputSearch/index';
import useRewriteRoute from '@/hooks/useRewriteRoute';

function SolicitacoesTecnicos() {
  const router = useRouter();
  const { id } = router.query;

  const perPage = 10;

  const { page = 1 } = router.query;

  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const { addModal, removeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const { id: userId, type } = useSelector(state => state.user);

  const route = useRewriteRoute(router);
  const [baseUrl, setBaseUrl] = useState('');
  const [willAccess, setWillAccess] = useState(true);

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  const [search, setSearch] = useState('');

  const { data: dataTec, error: errorTec, mutate: mutateTec } = useFetch(
    `/technicians-requests/find/by/property/${id}?limit=${perPage}&page=${page}&search=${search}`
  );

  useEffect(() => {
    if (!isEmpty(route?.path)) setBaseUrl(`${route.path}/${id}/tecnicos`);
  }, [route]);

  useEffect(() => {
    if (data)
      setWillAccess(
        !(
          [usersTypes[3], usersTypes[4]].includes(type) &&
          data?.users?.id !== userId
        )
      );
  }, [data]);

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await PropertiesService.deleteTechniciansPropertiesRequests(
        identifier
      ).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
        } else {
          mutateTec();

          setAlertMsg({
            type: 'success',
            message: 'A solicitação foi cancelada com sucesso!'
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
        title: `Cancelar essa Solicitação de Técnico?`,
        text: `Deseja realmente cancelar essa solicitação de técnico para relacioná-lo a essa propriedade?`,
        confirm: true,
        onConfirm: () => handleDelete(identifier),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  if (error || errorTec) return <Error error={error || errorTec} />;
  if ((!isEmpty(route) && !route.hasPermission) || !willAccess)
    return <Error error={404} />;

  return (
    <>
      <Head>
        <title>
          Solicitações de Técnicos na Propriedade {data && data.name} - Agro9
        </title>
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
              title={`Solicitações de Técnicos na propriedade
                ${data?.name}`}
              description="Aqui, você irá ver as solicitações de técnicos para relacioná-los
                a propriedade em questão"
              isLoading={isEmpty(data)}
            />
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
                      onSubmitSearch={q => setSearch(q)}
                    />
                  )}
                  {(((data && dataTec) || loading) && (
                    <>
                      <div className="table-responsive">
                        <Table>
                          <thead>
                            <tr>
                              <th>Nome do Técnico</th>
                              <th>Solicitado em</th>
                              <th>Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(!isEmpty(dataTec?.items) &&
                              dataTec.items.map(d => (
                                <tr key={d.id}>
                                  <td>{d.technicians.name}</td>
                                  <td>{dateConversor(d?.created_at)}</td>
                                  <td onClick={e => e.stopPropagation()}>
                                    <ActionButton
                                      id={d.id}
                                      path={baseUrl}
                                      noInfo
                                      noEdit
                                      noDelete
                                      noRemove={false}
                                      onDelete={() => handleDeleteModal(d.id)}
                                    />
                                  </td>
                                </tr>
                              ))) || (
                              <tr>
                                <td colSpan="3">
                                  Não há solicitações de técnicos para essa
                                  propriedade
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
                        totalPages={dataTec.meta.totalPages}
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

export default privateRoute()(SolicitacoesTecnicos);

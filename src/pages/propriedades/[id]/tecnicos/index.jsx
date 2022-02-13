import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUserSecret } from '@fortawesome/free-solid-svg-icons';

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
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import PropertiesService from '@/services/PropertiesService';
import { dateConversor } from '@/helpers/date';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import usersTypes from '@/helpers/usersTypes';
import InputSearch from '@/components/InputSearch/index';
import useRewriteRoute from '@/hooks/useRewriteRoute';

function Tecnicos() {
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
    `/technicians-properties/find/by/property/${id}?limit=${perPage}&page=${page}&search=${search}`
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

      await PropertiesService.deleteTechniciansProperties(identifier).then(
        res => {
          if (res.status >= 400 || res?.statusCode) {
            setAlertMsg({ type: 'error', message: errorMessage(res) });
          } else {
            mutateTec();

            setAlertMsg({
              type: 'success',
              message: 'O técnico foi removido com sucesso!'
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
        title: `Remover esse Técnico da Propriedade?`,
        text: `Deseja realmente remover esse técnico dessa propriedade?`,
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
          Técnicos Relacionados a Propriedade {data && data.name} - Agro9
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
              title={`Técnicos relacionados a propriedade ${data?.name}`}
              description="Aqui, você irá ver os técnicos relacionados da propriedade em
                questão"
              isLoading={isEmpty(data)}
            >
              <div className="buttons__container">
                <Link href={`${baseUrl}/solicitacoes/cadastrar`}>
                  <Button className="primary">
                    <FontAwesomeIcon icon={faPlus} /> Solicitar Técnico
                  </Button>
                </Link>
                <Link href={`${baseUrl}/solicitacoes`}>
                  <Button className="primary">
                    <FontAwesomeIcon icon={faUserSecret} /> Solicitações
                    Pendentes
                  </Button>
                </Link>
              </div>
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
                              <th>Adicionado em</th>
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
                                  Não há técnicos relacionados para essa
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

export default privateRoute()(Tecnicos);

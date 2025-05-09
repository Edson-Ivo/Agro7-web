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
import FieldsService from '@/services/FieldsService';
import Pagination from '@/components/Pagination/index';
import Error from '@/components/Error/index';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import maskString from '@/helpers/maskString';
import useUserAccess from '@/hooks/useUserAccess';
import InputSearch from '@/components/InputSearch/index';
import useRewriteRoute from '@/hooks/useRewriteRoute';

function Talhoes() {
  const router = useRouter();
  const { id } = router.query;

  const perPage = 10;

  const { page = 1 } = router.query;

  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const { addModal, removeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const route = useRewriteRoute(router);
  const [baseUrl, setBaseUrl] = useState('');

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  const [userAccess, loadingUserAccess] = useUserAccess(route, data?.users?.id);

  useEffect(() => {
    if (!isEmpty(route?.path)) setBaseUrl(`${route.path}/${id}/talhoes`);
  }, [route]);

  const [search, setSearch] = useState('');

  const {
    data: dataFields,
    error: errorFields,
    mutate: mutateFields
  } = useFetch(
    `/fields/find/by/property/${id}?limit=${perPage}&page=${page}&search=${search}`
  );

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await FieldsService.delete(identifier).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
        } else {
          mutateFields();

          setAlertMsg({
            type: 'success',
            message: 'O talhão foi deletado com sucesso!'
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
        title: `Deletar esse Talhão?`,
        text: `Deseja realmente deletar esse talhão?`,
        confirm: true,
        onConfirm: () => handleDelete(identifier),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  if (error || errorFields) return <Error error={error || errorFields} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Talhões da Propriedade {data && data.name} - Agro9</title>
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
              title={`Talhões da Propriedade ${data?.name}`}
              description="Aqui, você irá ver os talhões da propriedade em questão"
              isLoading={isEmpty(data) || loadingUserAccess}
            >
              {userAccess && (
                <>
                  <Link href={`${baseUrl}/cadastrar`}>
                    <Button className="primary">
                      <FontAwesomeIcon icon={faPlus} /> Novo Talhão
                    </Button>
                  </Link>
                </>
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
                      onSubmitSearch={q => setSearch(q)}
                    />
                  )}

                  {(((data && dataFields && !loadingUserAccess) || loading) && (
                    <>
                      <div className="table-responsive">
                        <Table>
                          <thead>
                            <tr>
                              <th>Nome do Talhão</th>
                              <th>Área</th>
                              <th>Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(!isEmpty(dataFields?.items) &&
                              dataFields.items.map(d => (
                                <tr
                                  key={d.id}
                                  onClick={() =>
                                    router.push(`${baseUrl}/${d.id}/detalhes`)
                                  }
                                >
                                  <td>{d.name}</td>
                                  <td>{`${maskString(d.area, 'area-in-table')}${
                                    d.type_dimension
                                  }`}</td>
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
                                <td colSpan="3">
                                  Não há talhões para essa propriedade
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
                        totalPages={dataFields.meta.totalPages}
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

export default privateRoute()(Talhoes);

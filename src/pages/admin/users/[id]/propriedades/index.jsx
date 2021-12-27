import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { Section, SectionHeader, SectionBody } from '@/components/Section';
import Button from '@/components/Button';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import Table from '@/components/Table';

import Loader from '@/components/Loader';
import Error from '@/components/Error';
import { useFetch } from '@/hooks/useFetch';
import ActionButton from '@/components/ActionButton';
import { useModal } from '@/hooks/useModal';

import { useRouter } from 'next/router';
import errorMessage from '@/helpers/errorMessage';
import PropertiesService from '@/services/PropertiesService';
import { Alert } from '@/components/Alert/index';
import Pagination from '@/components/Pagination/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import usersTypes from '@/helpers/usersTypes';
import InputSearch from '@/components/InputSearch/index';

function Properties() {
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { id, page = 1 } = router.query;
  const perPage = 10;

  const { addModal, removeModal } = useModal();

  const { data: dataUser, error: errorUser } = useFetch(
    `/users/find/by/id/${id}`
  );

  const [search, setSearch] = useState('');

  const { data, error, mutate } = useFetch(
    `/properties/find/by/user/${id}?limit=${perPage}&page=${page}&search=${search}`
  );

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await PropertiesService.delete(identifier).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
        } else {
          mutate();

          setAlertMsg({
            type: 'success',
            message: 'A propriedade foi deletada com sucesso!'
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
        title: 'Deletar Propriedade',
        text: 'Deseja realmente deletar esta propriedade?',
        confirm: true,
        onConfirm: () => handleDelete(identifier),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  if (error || errorUser) return <Error error={error || errorUser} />;

  return (
    <>
      <Head>
        <title>Painel Administrativo | Gerenciar Propriedades - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%usuario': dataUser?.name
              }}
              title={`Gerenciar Propriedades de ${dataUser?.name}`}
              isLoading={isEmpty(dataUser) || isEmpty(data)}
            >
              <Link href={`/admin/users/${id}/propriedades/cadastrar`}>
                <Button className="primary">
                  <FontAwesomeIcon icon={faPlus} /> Nova Propriedade
                </Button>
              </Link>
            </SectionHeaderContent>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alertMsg.message && (
                  <Alert type={alertMsg.type}>{alertMsg.message}</Alert>
                )}
                <InputSearch
                  url={`/admin/users/${id}/propriedades`}
                  onSubmitSearch={q => setSearch(q)}
                />
                {((data || loading) && !isEmpty(dataUser) && (
                  <>
                    <div className="table-responsive">
                      <Table>
                        <thead>
                          <tr>
                            <th>Nome da propriedade</th>
                            <th>Estado</th>
                            <th>Cidade</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(!isEmpty(data?.items) &&
                            data.items.map(p => (
                              <tr
                                key={p.id}
                                onClick={() =>
                                  router.push(
                                    `/admin/users/${id}/propriedades/${p.id}/detalhes`
                                  )
                                }
                              >
                                <td>{p.name}</td>
                                <td>{p?.addresses?.state}</td>
                                <td>{p?.addresses?.city}</td>
                                <td onClick={e => e.stopPropagation()}>
                                  <ActionButton
                                    id={p.id}
                                    path="/admin/propriedades"
                                    onDelete={() => handleDeleteModal(p.id)}
                                  />
                                </td>
                              </tr>
                            ))) || (
                            <tr>
                              <td colSpan="4">
                                Não há propriedades cadastradas para esse
                                usuário
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <Pagination
                      url={`/admin/users/${id}/propriedades`}
                      currentPage={page}
                      itemsPerPage={perPage}
                      totalPages={data.meta.totalPages}
                    />
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

export default privateRoute([usersTypes[0]])(Properties);

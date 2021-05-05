import React, { useCallback, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination/index';
import { useRouter } from 'next/router';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import { Alert } from '@/components/Alert';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import Error from '@/components/Error';
import Table from '@/components/Table';
import Loader from '@/components/Loader';

import { useFetch } from '@/hooks/useFetch';
import ActionButton from '@/components/ActionButton';
import { useModal } from '@/hooks/useModal';

import UsersService from '@/services/UsersService';
import errorMessage from '@/helpers/errorMessage';

function AdminUsers() {
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const perPage = 10;
  const { page = 1 } = router.query;

  const { data, error, mutate } = useFetch(
    `/users/find/all?limit=${perPage}&page=${page}`
  );
  const { addModal, removeModal } = useModal();

  const handleDelete = useCallback(
    async id => {
      removeModal();
      setLoading(true);

      await UsersService.deleteByAdmin(id).then(res => {
        if (res.status !== 200 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
        } else {
          mutate();

          setAlertMsg({
            type: 'success',
            message: 'Usuário deletado com sucesso!'
          });
        }
      });

      setLoading(false);
    },
    [addModal, removeModal]
  );

  const handleDeleteModal = useCallback(
    id => {
      addModal({
        title: 'Deletar Usuário',
        text: 'Deseja realmente deletar este usuário?',
        confirm: true,
        onConfirm: () => handleDelete(id),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>Painel Adminstrativo | Gerenciar Usuários - Agro7</title>
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
                  { route: '/admin', name: 'Painel Adminstrativo' },
                  { route: '/admin/users', name: 'Usuários' }
                ]}
              />
              <h2>Gerenciar Usuários</h2>
              <Link href="/admin/users/cadastrar">
                <Button className="primary">
                  <FontAwesomeIcon icon={faPlus} /> Novo Usuário
                </Button>
              </Link>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alertMsg.message && (
                  <Alert type={alertMsg.type}>{alertMsg.message}</Alert>
                )}
                {((data || loading) && (
                  <>
                    <div className="table-responsive">
                      <Table>
                        <thead>
                          <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Documento</th>
                            <th>Telefone</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(data?.items &&
                            data.items.map(user => (
                              <tr
                                key={user.id}
                                onClick={() =>
                                  router.push(
                                    `/admin/users/${user.id}/detalhes`
                                  )
                                }
                              >
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.documents}</td>
                                <td>{user.phone}</td>
                                <td onClick={e => e.stopPropagation()}>
                                  <ActionButton
                                    id={user.id}
                                    path="/admin/users"
                                    onDelete={() => handleDeleteModal(user.id)}
                                  />
                                </td>
                              </tr>
                            ))) || (
                            <tr>
                              <td colSpan="5">Não há usuários cadastrados</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <Pagination
                      url="/admin/users"
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

export default privateRoute(['administrator'])(AdminUsers);

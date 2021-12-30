import React, { useCallback, useState } from 'react';
import Head from 'next/head';

import Pagination from '@/components/Pagination/index';
import { useRouter } from 'next/router';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

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
import isEmpty from '@/helpers/isEmpty';
import maskString from '@/helpers/maskString';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import usersTypes from '@/helpers/usersTypes';
import InputSearch from '@/components/InputSearch/index';

function AdminUsersNotActive() {
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const perPage = 10;
  const { page = 1 } = router.query;

  const [search, setSearch] = useState('');

  const { data, error, mutate } = useFetch(
    `/users/find/without-verified-email/all?&limit=${perPage}&page=${page}&search=${search}`
  );
  const { addModal, removeModal } = useModal();

  const handleDelete = useCallback(
    async (id, type) => {
      removeModal();
      setLoading(true);

      const service =
        type === 'remove'
          ? UsersService.deleteSoftwareByAdmin(id)
          : UsersService.deletePermanentlyByAdmin(id);

      await service.then(res => {
        if (res.status !== 200 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
        } else {
          mutate();

          const message =
            type === 'remove'
              ? 'Usuário desativado com sucesso!'
              : 'Usuário deletado permanentemente com sucesso!';

          setAlertMsg({
            type: 'success',
            message
          });
        }
      });

      setLoading(false);
    },
    [addModal, removeModal]
  );

  const handleDeleteModal = useCallback(
    (id, type) => {
      let title = 'Deletar Usuário Permanentemente';
      let text =
        'Ao deletar esse usuário permanentemente, todas as suas propriedades e relacionados, caderno do produtor, vendas, etc., serão deletados do sistema, sem possibilidade de recuperação. Deseja continuar?';

      const onConfirm = () => handleDelete(id, type);

      if (type === 'remove') {
        title = 'Desativar Usuário';
        text =
          'Ao desativar esse usuário, algumas de suas informações ficarão indisponíveis, e ele perderá acesso ao sistema, contudo, será possível cadastrá-lo novamente e seus dados voltarão ao normal. Deseja continuar?';
      }

      addModal({
        title,
        text,
        confirm: true,
        onConfirm,
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  const handleResendMail = async id => {
    setLoading(true);

    await UsersService.resendConfirmEmail(id).then(res => {
      if (res.status !== 201 || res?.statusCode) {
        setAlertMsg({ type: 'error', message: errorMessage(res) });
      } else {
        setAlertMsg({
          type: 'success',
          message: 'E-mail de confirmação de conta reenviado com sucesso!'
        });
      }
    });

    setLoading(false);
  };

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>
          Painel Administrativo | Gerenciar Usuários Não Ativados - Agro7
        </title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title="Gerenciar Usuários Não Ativados"
              description="Aqui, você poderá gerenciar todos os usuários não ativados de seu sistema"
              isLoading={false}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alertMsg.message && (
                  <Alert type={alertMsg.type}>{alertMsg.message}</Alert>
                )}
                <InputSearch
                  url="/admin/users/nao-ativado"
                  onSubmitSearch={q => setSearch(q)}
                />
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
                          {(!isEmpty(data?.items) &&
                            data.items.map(user => (
                              <tr
                                key={user.id}
                                onClick={() =>
                                  router.push(
                                    `/admin/users/nao-ativado/${user.id}/detalhes`
                                  )
                                }
                              >
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                  {maskString(user.document, 'document') || ''}
                                </td>
                                <td>{maskString(user.phone, 'phone') || ''}</td>
                                <td onClick={e => e.stopPropagation()}>
                                  <ActionButton
                                    id={user.id}
                                    path="/admin/users/nao-ativado"
                                    noEdit
                                    noRemove={false}
                                    onRemove={() =>
                                      handleDeleteModal(user.id, 'remove')
                                    }
                                    onDelete={() =>
                                      handleDeleteModal(user.id, 'delete')
                                    }
                                    onResendMail={() => {
                                      handleResendMail(user.id);
                                    }}
                                  />
                                </td>
                              </tr>
                            ))) || (
                            <tr>
                              <td colSpan="5">
                                {!search
                                  ? `Não há usuários não ativados cadastrados`
                                  : `Não há usuários não ativados correspondentes à pesquisa`}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <Pagination
                      url="/admin/users/nao-ativado"
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

export default privateRoute([usersTypes[0]])(AdminUsersNotActive);

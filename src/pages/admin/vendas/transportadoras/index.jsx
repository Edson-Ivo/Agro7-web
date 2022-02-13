import React, { useState, useCallback } from 'react';
import Head from 'next/head';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import { Section, SectionHeader, SectionBody } from '@/components/Section';

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
import { Alert } from '@/components/Alert/index';
import Pagination from '@/components/Pagination/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import SalesService from '@/services/SalesService';
import { dateConversor } from '@/helpers/date';
import maskString from '@/helpers/maskString';
import usersTypes from '@/helpers/usersTypes';
import InputSearch from '@/components/InputSearch/index';

function AdminVendasTransportadoras() {
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { page = 1 } = router.query;
  const perPage = 10;

  const { addModal, removeModal } = useModal();

  const [search, setSearch] = useState('');

  const { data, error, mutate } = useFetch(
    `/transporters/find/all?limit=${perPage}&page=${page}&search=${search}`
  );

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await SalesService.deleteTransporter(identifier).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
        } else {
          mutate();

          setAlertMsg({
            type: 'success',
            message: 'Transportadora deletada com sucesso!'
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
        title: 'Deletar Transportadora',
        text: 'Deseja realmente deletar esta transportadora?',
        confirm: true,
        onConfirm: () => handleDelete(identifier),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>Painel Administrativo | Gerenciar Transportadoras - Agro9</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent title="Gerenciar Transportadoras" />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alertMsg.message && (
                  <Alert type={alertMsg.type}>{alertMsg.message}</Alert>
                )}
                <InputSearch
                  url="/admin/vendas/transportadoras"
                  onSubmitSearch={q => setSearch(q)}
                />
                {((data || loading) && (
                  <>
                    <div className="table-responsive">
                      <Table>
                        <thead>
                          <tr>
                            <th>Nome</th>
                            <th>Documento</th>
                            <th>Telefone</th>
                            <th>Usuário</th>
                            <th>Veículos</th>
                            <th>Data</th>
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
                                    `/admin/vendas/transportadoras/${p?.id}/detalhes`
                                  )
                                }
                              >
                                <td>{p?.name}</td>
                                <td>
                                  {maskString(p?.document, 'document') || ''}
                                </td>
                                <td>{maskString(p?.phone, 'phone') || ''}</td>
                                <td>{p?.users?.name}</td>
                                <td>{`${p?.vehicles?.length}`}</td>
                                <td>{dateConversor(p?.created_at, false)}</td>
                                <td onClick={e => e.stopPropagation()}>
                                  <ActionButton
                                    id={p.id}
                                    path={`/admin/vendas/transportadoras/${p?.id}`}
                                    noEdit
                                    onDelete={() => handleDeleteModal(p.id)}
                                  />
                                </td>
                              </tr>
                            ))) || (
                            <tr>
                              <td colSpan="7">
                                Não há transportadoras cadastradas
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <Pagination
                      url="/admin/vendas/transportadoras"
                      currentPage={page}
                      itemsPerPage={perPage}
                      totalPages={data?.meta?.totalPages}
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

export default privateRoute([usersTypes[0]])(AdminVendasTransportadoras);

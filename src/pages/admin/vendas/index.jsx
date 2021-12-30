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
import objectToQuery from '@/helpers/objectToQuery';
import InputSearch from '@/components/InputSearch/index';

function AdminVendas() {
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { page = 1 } = router.query;
  const perPage = 10;

  const { addModal, removeModal } = useModal();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    date_start: '',
    date_finish: ''
  });

  const { data, error, mutate } = useFetch(
    `/sales/find/all?limit=${perPage}&page=${page}&page=${page}&search=${search}&${objectToQuery(
      filters
    )}`
  );

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await SalesService.delete(identifier).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
        } else {
          mutate();

          setAlertMsg({
            type: 'success',
            message: 'Venda foi deletada com sucesso!'
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
        title: 'Deletar Venda',
        text: 'Deseja realmente deletar esta venda?',
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
        <title>Painel Administrativo | Gerenciar Vendas - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent title="Gerenciar Vendas" />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alertMsg.message && (
                  <Alert type={alertMsg.type}>{alertMsg.message}</Alert>
                )}
                <InputSearch
                  url="/admin/vendas"
                  filters={{ date: true }}
                  onFilterChange={f => setFilters({ ...f })}
                  onSubmitSearch={q => setSearch(q)}
                />
                {((data || loading) && (
                  <>
                    <div className="table-responsive">
                      <Table>
                        <thead>
                          <tr>
                            <th>Lote</th>
                            <th>Propriedade</th>
                            <th>Produto</th>
                            <th>Quantidade</th>
                            <th>Valor</th>
                            <th>Data</th>
                            <th>Distribuidora</th>
                            <th>Transportadora</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(!isEmpty(data?.items) &&
                            data.items.map(p => (
                              <tr
                                key={p.id}
                                onClick={() =>
                                  router.push(`/admin/vendas/${p?.id}/detalhes`)
                                }
                              >
                                <td>{p?.batch}</td>
                                <td>
                                  {
                                    p?.harvests_sales?.[0]?.harvests?.cultures
                                      ?.fields?.properties?.name
                                  }
                                </td>
                                <td>
                                  {`${
                                    p?.harvests_sales?.[0]?.harvests?.cultures
                                      ?.products?.name
                                  }${
                                    p?.harvests_sales?.[0]?.harvests?.is_green
                                      ? ' Verde'
                                      : ''
                                  }`}
                                </td>
                                <td>{`${p?.total_quantity}${p?.type_unity}`}</td>
                                <td>{maskString(p?.value, 'money')}</td>
                                <td>{dateConversor(p?.created_at, false)}</td>
                                <td>{p?.distributors?.name}</td>
                                <td>
                                  {
                                    p?.vehicles_sales?.vehicles?.transporters
                                      ?.name
                                  }
                                </td>
                                <td onClick={e => e.stopPropagation()}>
                                  <ActionButton
                                    id={p.id}
                                    path="/admin/vendas"
                                    noEdit
                                    onDelete={() => handleDeleteModal(p.id)}
                                  />
                                </td>
                              </tr>
                            ))) || (
                            <tr>
                              <td colSpan="9">Não há vendas cadastradas</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <Pagination
                      url="/admin/vendas"
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

export default privateRoute([usersTypes[0]])(AdminVendas);

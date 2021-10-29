import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck,
  faStore,
  faPlus,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Button from '@/components/Button';
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

function Vendas() {
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { page = 1 } = router.query;
  const perPage = 10;

  const { type } = useSelector(state => state.user);

  const { addModal, removeModal } = useModal();

  const { data, error, mutate } = useFetch(
    `/sales/find/by/user-logged?limit=${perPage}&page=${page}`
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
        <title>Suas Vendas - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent title="Suas Vendas">
              <div className="buttons__container">
                <Link href="/vendas/cadastrar">
                  <Button className="primary">
                    <FontAwesomeIcon icon={faPlus} /> Nova Venda
                  </Button>
                </Link>
                <Link href="/vendas/distribuidoras/">
                  <Button className="primary">
                    <FontAwesomeIcon icon={faStore} /> Distribuidoras
                  </Button>
                </Link>
                <Link href="/vendas/transportadoras/">
                  <Button className="primary">
                    <FontAwesomeIcon icon={faTruck} /> Transportadoras
                  </Button>
                </Link>
                <Link href="/vendas/relatorio/">
                  <Button className="primary">
                    <FontAwesomeIcon icon={faFileAlt} /> Relatório
                  </Button>
                </Link>
              </div>
            </SectionHeaderContent>
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
                                  router.push(`/vendas/${p?.id}/detalhes`)
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
                                    path="/vendas"
                                    noEdit
                                    noDelete={type !== usersTypes[0]}
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
                      url="/vendas"
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

export default privateRoute([
  usersTypes[0],
  usersTypes[1],
  usersTypes[2],
  usersTypes[4]
])(Vendas);

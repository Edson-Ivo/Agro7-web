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

import errorMessage from '@/helpers/errorMessage';
import ColorsContainer from '@/components/ColorsContainer/index';
import truncate from '@/helpers/truncate';
import CategoriesService from '@/services/CategoriesService';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

function AdminCategories() {
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const perPage = 10;
  const { page = 1 } = router.query;

  const { data, error, mutate } = useFetch(
    `/categories/find/all?limit=${perPage}&page=${page}`
  );

  const [baseUrl] = useState(`/admin/categorias`);

  const { addModal, removeModal } = useModal();

  const handleDelete = useCallback(
    async id => {
      removeModal();
      setLoading(true);

      await CategoriesService.delete(id).then(res => {
        if (res.status !== 200 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
        } else {
          mutate();

          setAlertMsg({
            type: 'success',
            message: 'Categoria deletada com sucesso!'
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
        title: 'Deletar Categoria',
        text: 'Deseja realmente deletar esta categoria?',
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
        <title>Painel Administrativo | Gerenciar Categorias - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumb={[
                { route: '/', name: 'Home' },
                { route: '/admin', name: 'Painel Administrativo' },
                { route: baseUrl, name: 'Categorias' }
              ]}
              title="Gerenciar Categorias"
              description="Aqui você poderá gerenciar todas as categorias de seu sistema"
            >
              <Link href={`${baseUrl}/cadastrar`}>
                <Button className="primary">
                  <FontAwesomeIcon icon={faPlus} /> Nova Categoria
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
                {((data || loading) && (
                  <>
                    <div className="table-responsive">
                      <Table>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'center' }}>Cor</th>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(data?.items &&
                            data.items.map(d => (
                              <tr
                                key={d.id}
                                onClick={() =>
                                  router.push(`${baseUrl}/${d.id}/detalhes`)
                                }
                              >
                                <td>
                                  <ColorsContainer
                                    fillColor={d.colors.hexadecimal}
                                    size={35}
                                  />
                                </td>
                                <td>{d.name}</td>
                                <td>{truncate(d.description, 70)}</td>
                                <td onClick={e => e.stopPropagation()}>
                                  <ActionButton
                                    id={d.id}
                                    path={baseUrl}
                                    noDelete={!d.can_delete}
                                    onDelete={() => handleDeleteModal(d.id)}
                                  />
                                </td>
                              </tr>
                            ))) || (
                            <tr>
                              <td colSpan="4">Não há categorias cadastrados</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <Pagination
                      url={baseUrl}
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

export default privateRoute(['administrador'])(AdminCategories);

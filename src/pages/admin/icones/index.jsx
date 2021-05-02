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

import errorMessage from '@/helpers/errorMessage';
import truncate from '@/helpers/truncate';
import IconsService from '@/services/IconsService';

function AdminIcons({ permission }) {
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const perPage = 10;
  const { page = 1 } = router.query;

  const { data, error, mutate } = useFetch(
    `/icons/find/all?limit=${perPage}&page=${page}`
  );
  const { addModal, removeModal } = useModal();

  const handleDelete = useCallback(
    async id => {
      removeModal();
      setLoading(true);

      await IconsService.delete(id).then(res => {
        if (res.status !== 200 || res?.statusCode) {
          setAlertMsg(errorMessage(res));
        } else {
          mutate();

          setAlertMsg({
            type: 'success',
            message: 'Ícone deletado com sucesso!'
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
        title: 'Deletar Ícone',
        text: 'Deseja realmente deletar este ícone?',
        confirm: true,
        onConfirm: () => handleDelete(id),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  if (!permission) return <Error error={404} />;
  if (error) return <Error />;

  return (
    <>
      <Head>
        <title>
          Painel Adminstrativo | Gerenciar Ícones de Categoria - Agro7
        </title>
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
                  { route: '/admin/icones', name: 'Ícones para Categorias' }
                ]}
              />
              <h2>Gerenciar Ícones</h2>
              <p>
                Aqui você poderá gerenciar todos os ícones para utilizá-los nas
                categorias
              </p>
              <Link href="/admin/icones/cadastrar">
                <Button className="primary">
                  <FontAwesomeIcon icon={faPlus} /> Novo Ícone
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
                                  router.push(`/admin/icones/${d.id}/detalhes`)
                                }
                              >
                                <td>{d.name}</td>
                                <td>{truncate(d.description, 70)}</td>
                                <td onClick={e => e.stopPropagation()}>
                                  <ActionButton
                                    id={d.id}
                                    path="/admin/icones"
                                    download={d.url}
                                    onDelete={() => handleDeleteModal(d.id)}
                                  />
                                </td>
                              </tr>
                            ))) || (
                            <tr>
                              <td colSpan="3">Não há ícones cadastrados</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <Pagination
                      url="/admin/icones"
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

export default privateRoute(['administrator'])(AdminIcons);

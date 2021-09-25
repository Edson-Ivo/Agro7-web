import React, { useCallback, useState } from 'react';
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

import { useRouter } from 'next/router';
import Pagination from '@/components/Pagination/index';
import { useModal } from '@/hooks/useModal';
import errorMessage from '@/helpers/errorMessage';
import PropertiesService from '@/services/PropertiesService';
import { Alert } from '@/components/Alert/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

function RequestsTechnichian() {
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { id, page = 1 } = router.query;
  const perPage = 10;

  const { data: dataUser, error: errorUser } = useFetch(
    `/users/find/by/id/${id}`
  );

  const { data, error, mutate } = useFetch(
    `/technicians-requests/find/by/technician/${id}?limit=${perPage}&page=${page}`
  );

  const { addModal, removeModal } = useModal();

  const handleUpdate = useCallback(
    async (identifier, accepted) => {
      removeModal();
      setLoading(true);

      await PropertiesService.updateTechniciansPropertiesRequests(identifier, {
        accepted
      }).then(res => {
        if (res.status !== 200 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
        } else {
          mutate();

          setAlertMsg({
            type: 'success',
            message: `Solicitação ${
              accepted ? 'aceita' : 'recusada'
            } com sucesso!`
          });
        }
      });

      setLoading(false);
    },
    [addModal, removeModal]
  );

  const handleUpdateModal = useCallback(
    (identifier, accepted) => {
      addModal({
        title: 'Solicitação Técnica',
        text: `Deseja realmente ${
          accepted ? 'aceitar' : 'recusar'
        } essa solicitação técnica?`,
        confirm: true,
        onConfirm: () => handleUpdate(identifier, accepted),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  if (error || errorUser) return <Error error={error || errorUser} />;
  if (dataUser && dataUser?.type !== 'tecnico') return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Painel Administrativo | Solicitação Técnica - Agro7</title>
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
              title="Solicitações Técnica"
              description={`Aqui, você irá gerenciar todas as solicitações técnicas de
                propriedades para o técnico ${dataUser?.name}.`}
              isLoading={isEmpty(dataUser)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alertMsg.message && (
                  <Alert type={alertMsg.type}>{alertMsg.message}</Alert>
                )}
                {((data || loading) && dataUser && (
                  <>
                    <div className="table-responsive">
                      <Table>
                        <thead>
                          <tr>
                            <th>Mensagem</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(!isEmpty(data?.items) &&
                            data.items.map(p => (
                              <tr key={p.id}>
                                <td>{`${p?.properties?.users?.name} solicitou para que o técnico ${dataUser?.name} trabalhe na propriedade ${p?.properties?.name}.`}</td>
                                <td>
                                  <ActionButton
                                    id={p.id}
                                    path={`/admin/users/${id}/tecnico/solicitacoes`}
                                    onAccept={() =>
                                      handleUpdateModal(p.id, true)
                                    }
                                    onDelete={() =>
                                      handleUpdateModal(p.id, false)
                                    }
                                    noInfo
                                    noEdit
                                    noAccept={false}
                                    noRemove={false}
                                    noDelete
                                  />
                                </td>
                              </tr>
                            ))) || (
                            <tr>
                              <td colSpan="2">
                                Não há solicitações técnicas no momento
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <Pagination
                      url={`/admin/users/${id}/tecnico/solicitacoes`}
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

export default privateRoute(['administrador'])(RequestsTechnichian);

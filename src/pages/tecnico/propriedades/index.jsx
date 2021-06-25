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
import { useSelector } from 'react-redux';
import { useModal } from '@/hooks/useModal';
import errorMessage from '@/helpers/errorMessage';
import PropertiesService from '@/services/PropertiesService';
import { Alert } from '@/components/Alert/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

function PropertiesTechnichian() {
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const { id } = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { page = 1 } = router.query;
  const perPage = 10;

  const { data, error, mutate } = useFetch(
    `/technicians-properties/find/by/technician/${id}?limit=${perPage}&page=${page}`
  );

  const { addModal, removeModal } = useModal();

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await PropertiesService.deleteTechniciansProperties(identifier).then(
        res => {
          if (res.status >= 400 || res?.statusCode) {
            setAlertMsg({ type: 'error', message: errorMessage(res) });
          } else {
            mutate();

            setAlertMsg({
              type: 'success',
              message: 'Propriedade desconctada com sucesso!'
            });
          }
        }
      );

      setLoading(false);
    },
    [addModal, removeModal]
  );

  const handleDeleteModal = useCallback(
    identifier => {
      addModal({
        title: 'Desconectar da Propriedade',
        text: 'Deseja realmente desconectar dessa propriedade?',
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
        <title>Propriedades Relacionadas - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title="Propriedades Relacionadas"
              description="Aqui você irá ver todas as propriedades que estão relacionadas
                com seu usuário de técnico."
            />
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
                            <th>Propriedade</th>
                            <th>Produtor</th>
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
                                    `/tecnico/propriedades/${p.properties.id}/detalhes`
                                  )
                                }
                              >
                                <td>{p.properties.name}</td>
                                <td>{p.properties?.users?.name}</td>
                                <td>{p.properties?.addresses?.state}</td>
                                <td>{p.properties?.addresses?.city}</td>
                                <td onClick={e => e.stopPropagation()}>
                                  <ActionButton
                                    id={p.properties.id}
                                    path="/tecnico/propriedades"
                                    onDelete={() => handleDeleteModal(p.id)}
                                    noRemove={false}
                                    noDelete
                                  />
                                </td>
                              </tr>
                            ))) || (
                            <tr>
                              <td colSpan="5">
                                Não há propriedades relacionadas
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <Pagination
                      url="/tecnico/propriedades"
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

export default privateRoute(['tecnico'])(PropertiesTechnichian);

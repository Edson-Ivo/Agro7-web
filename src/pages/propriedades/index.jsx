import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
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
import { useSelector } from 'react-redux';

import { useRouter } from 'next/router';
import errorMessage from '@/helpers/errorMessage';
import PropertiesService from '@/services/PropertiesService';
import { Alert } from '@/components/Alert/index';
import Pagination from '@/components/Pagination/index';

function Properties() {
  const { id } = useSelector(state => state.user);
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { page = 1 } = router.query;
  const perPage = 10;

  const { addModal, removeModal } = useModal();

  const { data, error, mutate } = useFetch(
    `/properties/find/by/user/${id}?perPage=${perPage}&page=${page}`
  );

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await PropertiesService.delete(identifier).then(res => {
        if (res.status > 400 || res?.statusCode) {
          setAlertMsg(errorMessage(res));
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

  if (error) return <Error />;

  return (
    <>
      <Head>
        <title>Painel do Usuário | Suas propriedades - Agro7</title>
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
                  { route: '/propriedades', name: 'Propriedades' }
                ]}
              />
              <h2>Suas propriedades</h2>
              <Link href="/propriedades/cadastrar">
                <Button className="primary">
                  <FontAwesomeIcon icon={faPlus} /> Nova Propriedade
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
                            <th>Nome da propriedade</th>
                            <th>Estado</th>
                            <th>Cidade</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(data?.properties.length > 0 &&
                            data.properties.map(p => (
                              <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.addresses.state}</td>
                                <td>{p.addresses.city}</td>
                                <td>
                                  <ActionButton
                                    id={p.id}
                                    path="/propriedades"
                                    info="/info"
                                    edit="/edit"
                                    onDelete={() => handleDeleteModal(p.id)}
                                  />
                                </td>
                              </tr>
                            ))) || (
                            <tr>
                              <td colSpan="4">
                                Não há propriedades cadastradas
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <Pagination
                      url="propriedades"
                      actual={page}
                      evaluate={data?.properties}
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

export default privateRoute()(Properties);

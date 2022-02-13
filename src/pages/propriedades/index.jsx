import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
import PropertiesService from '@/services/PropertiesService';
import { Alert } from '@/components/Alert/index';
import Pagination from '@/components/Pagination/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import usersTypes from '@/helpers/usersTypes';
import InputSearch from '@/components/InputSearch/index';

function Properties() {
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const router = useRouter();

  const { page = 1 } = router.query;
  const perPage = 10;

  const { addModal, removeModal } = useModal();

  const { data, error, mutate } = useFetch(
    `/properties/find/by/user-logged?limit=${perPage}&page=${page}&search=${search}`
  );

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await PropertiesService.delete(identifier).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
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

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>Suas Propriedades - Agro9</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent title="Suas Propriedades">
              <Link href="/propriedades/cadastrar">
                <Button className="primary">
                  <FontAwesomeIcon icon={faPlus} /> Nova Propriedade
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
                <InputSearch
                  url="/propriedades"
                  onSubmitSearch={q => setSearch(q)}
                />
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
                          {(!isEmpty(data?.items) &&
                            data.items.map(p => (
                              <tr
                                key={p.id}
                                onClick={() =>
                                  router.push(`/propriedades/${p.id}/detalhes`)
                                }
                              >
                                <td>{p.name}</td>
                                <td>{p?.addresses?.state}</td>
                                <td>{p?.addresses?.city}</td>
                                <td onClick={e => e.stopPropagation()}>
                                  <ActionButton
                                    id={p.id}
                                    path="/propriedades"
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
                      url="/propriedades"
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

export default privateRoute([
  usersTypes[0],
  usersTypes[1],
  usersTypes[2],
  usersTypes[4]
])(Properties);

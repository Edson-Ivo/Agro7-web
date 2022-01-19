import React, { useState, useCallback, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Form } from '@unform/web';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Loader from '@/components/Loader';
import Button from '@/components/Button';
import Table from '@/components/Table';
import { Alert } from '@/components/Alert';
import { useModal } from '@/hooks/useModal';

import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { useFetch } from '@/hooks/useFetch';
import { privateRoute } from '@/components/PrivateRoute';
import { useRouter } from 'next/router';
import ActionButton from '@/components/ActionButton';
import errorMessage from '@/helpers/errorMessage';
import isEmpty from '@/helpers/isEmpty';
import Select from '@/components/Select';
import Pagination from '@/components/Pagination';
import { dateConversor } from '@/helpers/date';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import FieldsActionsService, {
  actionsList
} from '@/services/FieldsActionsService';
import objectKeyExists from '@/helpers/objectKeyExists';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import usersTypes from '@/helpers/usersTypes';

function AcoesTalhao() {
  const router = useRouter();
  const formRef = useRef(null);

  const { id, fieldId, typeAction = 'supplies' } = router.query;

  const perPage = 10;

  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState({});
  const [baseUrl, setBaseUrl] = useState('');
  const [fieldSupplyDataRoute, setFieldSupplyDataRoute] = useState('');
  const [page, setPage] = useState(1);

  const { type } = useSelector(state => state.user);

  const { addModal, removeModal } = useModal();
  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const {
    data: dataActions,
    error: errorActions,
    mutate: mutateActions
  } = useFetch(
    (typeAction !== 'supplies' &&
      `/fields-${typeAction}/find/by/field/${fieldId}?limit=${perPage}&page=${page}`) ||
      (!isEmpty(fieldSupplyDataRoute)
        ? `/supplies/find/by/${fieldSupplyDataRoute}?limit=${perPage}&page=${page}`
        : null)
  );

  useEffect(() => {
    setRoute(urlRoute(router, type, [usersTypes[3], usersTypes[4]]));
  }, []);

  useEffect(() => {
    setFieldSupplyDataRoute('');

    if (!isEmpty(data)) {
      const userId = data?.properties?.users?.id;

      if (type === usersTypes[0] && router.query?.userId === String(userId)) {
        setFieldSupplyDataRoute(`user/${userId}`);
      } else {
        setFieldSupplyDataRoute(`user-logged`);
      }
    }
  }, [data]);

  useEffect(() => {
    setBaseUrl(`${route.path}/${id}/talhoes/${fieldId}/acoes`);
  }, [route]);

  const handleDelete = useCallback(
    async (identifier, typeAct) => {
      removeModal();
      setLoading(true);

      setAlertMsg({ type: 'success', message: 'Deletando documento...' });

      await FieldsActionsService.delete(identifier, typeAct).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
        } else {
          mutateActions();

          setAlertMsg({
            type: 'success',
            message: 'Ação foi deletada com sucesso!'
          });
        }
      });

      setLoading(false);
    },
    [addModal, removeModal]
  );

  const handleDeleteModal = useCallback(
    (identifier, typeAct) => {
      addModal({
        title: `Deletar essa Ação?`,
        text: `Deseja realmente deletar essa ação?`,
        confirm: true,
        onConfirm: () => handleDelete(identifier, typeAct),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  const handleChangeTypeAction = e => {
    setPage(1);
    router.replace(`${baseUrl}?typeAction=${e?.value || ''}`);
  };

  if (error || errorActions) return <Error error={error || errorActions} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;
  if (!objectKeyExists(actionsList, typeAction)) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Ações do Talhão {data && data?.name} - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%propriedade': data?.properties.name,
                '%talhao': data?.name
              }}
              title={`Ações do Talhão ${data?.name}`}
              description={`Aqui, você irá ver as ações do talhão ${data?.name} da propriedade ${data?.properties?.name}.`}
              isLoading={isEmpty(data)}
            >
              <Link href={`${baseUrl}/cadastrar`}>
                <Button className="primary">
                  <FontAwesomeIcon icon={faPlus} /> Cadastrar Ação
                </Button>
              </Link>
            </SectionHeaderContent>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                <>
                  {alertMsg.message && (
                    <Alert type={alertMsg.type}>{alertMsg.message}</Alert>
                  )}
                  <Form ref={formRef} initialData={{ types: typeAction }}>
                    <Select
                      options={Object.keys(actionsList).map(action => ({
                        value: actionsList[action].value,
                        label: actionsList[action].label
                      }))}
                      label="Filtrar por Ação"
                      name="types"
                      onChange={handleChangeTypeAction}
                    />
                  </Form>
                  {(((!isEmpty(typeAction) && data && dataActions) ||
                    loading) && (
                    <>
                      <div className="table-responsive">
                        <Table>
                          <thead>
                            <tr>
                              <th>Lista</th>
                              <th>Adicionado em</th>
                              <th>Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(!isEmpty(dataActions?.items) &&
                              dataActions.items.map(d => (
                                <tr
                                  key={d.id}
                                  onClick={() =>
                                    router.push(
                                      `${baseUrl}/${typeAction}/${d.id}/detalhes`
                                    )
                                  }
                                >
                                  <td>
                                    {FieldsActionsService.text(typeAction, d)}
                                  </td>
                                  <td>{dateConversor(d.created_at, false)}</td>
                                  <td onClick={e => e.stopPropagation()}>
                                    <ActionButton
                                      id={d.id}
                                      path={`${baseUrl}/${typeAction}`}
                                      onDelete={() =>
                                        handleDeleteModal(d.id, typeAction)
                                      }
                                    />
                                  </td>
                                </tr>
                              ))) || (
                              <tr>
                                <td colSpan="3">
                                  Não há ações de{' '}
                                  {actionsList[typeAction].label.toLowerCase()}{' '}
                                  registradas nesse talhão
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                      <Pagination
                        setPage={setPage}
                        currentPage={page}
                        itemsPerPage={perPage}
                        totalPages={dataActions?.meta?.totalPages}
                      />
                    </>
                  )) || <Loader />}
                </>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(AcoesTalhao);

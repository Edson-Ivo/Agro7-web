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
import CulturesActionsService, {
  actionsList
} from '@/services/CulturesActionsService';
import objectKeyExists from '@/helpers/objectKeyExists';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

function AcoesCultura() {
  const router = useRouter();
  const formRef = useRef(null);

  const {
    id,
    fieldId,
    cultureId,
    typeAction = 'services',
    page = 1
  } = router.query;

  const perPage = 10;

  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState({});
  const [baseUrl, setBaseUrl] = useState('');

  const { type } = useSelector(state => state.user);

  const { addModal, removeModal } = useModal();
  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const {
    data: dataActions,
    error: errorActions,
    mutate: mutateActions
  } = useFetch(
    `/cultures-${typeAction}/find/by/culture/${cultureId}?limit=${perPage}&page=${page}`
  );

  useEffect(() => {
    setRoute(urlRoute(router, type, ['tecnico']));
  }, []);

  useEffect(() => {
    setBaseUrl(
      `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/acoes`
    );
  }, [route]);

  const handleDelete = useCallback(
    async (identifier, typeAct) => {
      removeModal();
      setLoading(true);

      await CulturesActionsService.delete(identifier, typeAct).then(res => {
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

  const handleChangeTypeAction = e =>
    router.replace(`${baseUrl}?typeAction=${e?.value || ''}`);

  if (error || errorCultures || errorActions)
    return <Error error={error || errorCultures || errorActions} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && fieldId !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;
  if (!objectKeyExists(actionsList, typeAction)) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>
          Ações na Cultura de {dataCultures?.products.name} do Talhão{' '}
          {data && data.name} - Agro7
        </title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%propriedade': data?.properties.name,
                '%talhao': data?.name,
                '%cultura': dataCultures?.products?.name
              }}
              title={`Ações na Cultura de ${dataCultures?.products?.name} do Talhão ${data?.name}`}
              description={`Aqui você irá ver as ações na cultura de ${dataCultures?.products?.name} do talhão ${data?.name} da propriedade ${data?.properties?.name}.`}
              isLoading={isEmpty(data)}
            >
              <Link href={`${baseUrl}/cadastrar`}>
                <Button className="primary">
                  <FontAwesomeIcon icon={faPlus} /> Registrar Ação
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
                  {(((!isEmpty(typeAction) &&
                    data &&
                    dataCultures &&
                    dataActions) ||
                    loading) && (
                    <>
                      <div className="table-responsive">
                        <Table>
                          <thead>
                            <tr>
                              <th>Lista</th>
                              <th>Criado em</th>
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
                                    {CulturesActionsService.text(typeAction, d)}
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
                                  registradas nessa cultura
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                      <Pagination
                        url={`${baseUrl}`}
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

export default privateRoute()(AcoesCultura);

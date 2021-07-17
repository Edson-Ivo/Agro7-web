import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
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
import Pagination from '@/components/Pagination';
import HarvestsService from '@/services/HarvestsService';
import { dateConversor } from '@/helpers/date';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

function Colheitas() {
  const router = useRouter();
  const { id, fieldId, cultureId, page = 1 } = router.query;

  const perPage = 10;

  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const { addModal, removeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const {
    data: dataHarvests,
    error: errorHarvests,
    mutate: mutateHarvests
  } = useFetch(
    `/harvests/find/by/culture/${cultureId}?limit=${perPage}&page=${page}`
  );

  const { type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setRoute(urlRoute(router, type, ['tecnico']));
  }, []);

  useEffect(() => {
    setBaseUrl(
      `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/colheitas`
    );
  }, [route]);

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      await HarvestsService.delete(identifier).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlertMsg({ type: 'error', message: errorMessage(res) });
        } else {
          mutateHarvests();

          setAlertMsg({
            type: 'success',
            message: 'A colheita foi deletada com sucesso!'
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
        title: `Deletar essa Colheita?`,
        text: `Deseja realmente deletar essa colheita?`,
        confirm: true,
        onConfirm: () => handleDelete(identifier),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  if (error || errorCultures || errorHarvests)
    return <Error error={error || errorCultures || errorHarvests} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && fieldId !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>
          Colheitas da Cultura de {dataCultures?.products.name} do Talhão{' '}
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
              title={`Colheitas da Cultura de ${dataCultures?.products?.name} do Talhão ${data?.name}`}
              description={`Aqui você irá ver as colheitas da cultura de ${dataCultures?.products?.name} do talhão ${data?.name} da propriedade ${data?.properties?.name}.`}
              isLoading={isEmpty(data) || isEmpty(dataCultures)}
            >
              <Link href={`${baseUrl}/cadastrar`}>
                <Button className="primary">
                  <FontAwesomeIcon icon={faPlus} /> Registrar Colheita
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
                  {(((data && dataCultures && dataHarvests) || loading) && (
                    <>
                      <div className="table-responsive">
                        <Table>
                          <thead>
                            <tr>
                              <th>Data</th>
                              <th>Quantidade</th>
                              <th>Previsão</th>
                              <th>Quantidade Prevista</th>
                              <th>Verde?</th>
                              <th>Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(!isEmpty(dataHarvests?.items) &&
                              dataHarvests.items.map(d => (
                                <tr
                                  key={d.id}
                                  onClick={() =>
                                    router.push(`${baseUrl}/${d.id}/detalhes`)
                                  }
                                >
                                  <td>{dateConversor(d?.date, false)}</td>
                                  <td>{`${d?.quantity}${d?.type}`}</td>
                                  <td>{dateConversor(d?.forecast, false)}</td>
                                  <td>{`${d?.quantity_forecast}${d?.type}`}</td>
                                  <td>{d?.is_green ? 'Sim' : 'Não'}</td>
                                  <td onClick={e => e.stopPropagation()}>
                                    <ActionButton
                                      id={d.id}
                                      path={baseUrl}
                                      noEdit
                                      onDelete={() => handleDeleteModal(d.id)}
                                    />
                                  </td>
                                </tr>
                              ))) || (
                              <tr>
                                <td colSpan="6">
                                  Não há colheitas registradas nessa cultura
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
                        totalPages={dataHarvests.meta.totalPages}
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

export default privateRoute()(Colheitas);

import React, { useEffect, useState } from 'react';
import Head from 'next/head';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination/index';

import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';

import Loader from '@/components/Loader';
import Error from '@/components/Error';
import { useFetch } from '@/hooks/useFetch';

import { Alert } from '@/components/Alert/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import { dateConversor } from '@/helpers/date';
import InputDateInterval from '@/components/InputDateInterval/index';
import Chart from '@/components/Chart/index';
import theme from '@/styles/theme';
import usersTypes from '@/helpers/usersTypes';

function AdminProjecaoColheita() {
  const perPage = 30;
  const [page, setPage] = useState(1);

  const [alertMsg, setAlertMsg] = useState('');
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [dataProductId, setDataProductId] = useState([]);
  const [dataProductGreen, setDataProductGreen] = useState([]);
  const [dataProductName, setDataProductName] = useState([]);
  const [dataProductTotal, setDataProductTotal] = useState([]);

  const [dataSelectedProductIsGreen, setDataSelectedProductIsGreen] = useState(
    0
  );
  const [dataSelectedProductName, setDataSelectedProductName] = useState('');

  const [chartAnimation, setChartAnimation] = useState(true);

  const { data: dataChart, error: errorChart } = useFetch(
    dateStart && dateEnd
      ? `/charts/find/harvests-projection/all?date_start=${dateStart}&date_finish=${dateEnd}`
      : null
  );

  const { data: dataChartProduct, errorChartProduct } = useFetch(
    dateStart && dateEnd && selectedProduct
      ? `/charts/find/harvests-users/all/by/product/${selectedProduct}?date_start=${dateStart}&date_finish=${dateEnd}&is_green=${dataSelectedProductIsGreen}&limit=${perPage}&page=${page}`
      : null
  );

  const handleChangeDateStart = date => setDateStart(date);

  const handleChangeDateEnd = date => setDateEnd(date);

  const handleSelectProduct = productActiveList => {
    if (!isEmpty(dataProductId) && !isEmpty(productActiveList)) {
      const [{ index }] = productActiveList;

      setChartAnimation(false);
      setDataSelectedProductIsGreen(Number(dataProductGreen[index]));
      setDataSelectedProductName(dataProductName[index]);
      setSelectedProduct(dataProductId[index]);
    }
  };

  useEffect(() => {
    if (!isEmpty(dataChart)) {
      const { harvests_projection: harvestsProjection } = dataChart;

      setDataProductId([]);
      setDataProductGreen([]);
      setDataProductName([]);
      setDataProductTotal([]);

      setChartAnimation(true);

      harvestsProjection.forEach(
        ({ id_product: idProduct, is_green: isGreen, product, total }) => {
          setDataProductId(prevDataProductId => [
            idProduct,
            ...prevDataProductId
          ]);
          setDataProductGreen(prevDataProductGreen => [
            isGreen,
            ...prevDataProductGreen
          ]);
          setDataProductName(prevDataProductName => [
            `${product}${isGreen ? ' verde' : ''}`,
            ...prevDataProductName
          ]);
          setDataProductTotal(prevDataProductTotal => [
            total,
            ...prevDataProductTotal
          ]);
        }
      );
    }
  }, [dataChart]);

  if (errorChart || errorChartProduct)
    return <Error error={errorChart || errorChartProduct} />;

  return (
    <>
      <Head>
        <title>
          Painel Administrativo | Gerenciar Projeção das Colheitas - Agro7
        </title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title="Gerenciar Projeção das Colheitas"
              description="Aqui, você poderá gerenciar todas as projeções das colheitas no sistema."
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                <Alert type="info">
                  Selecione o período que você deseja gerar o gráfico:
                </Alert>
                {alertMsg && <Alert type="error">{alertMsg}</Alert>}
                <InputDateInterval
                  onError={setAlertMsg}
                  onDateStartSelect={handleChangeDateStart}
                  onDateEndSelect={handleChangeDateEnd}
                  style={{ marginBottom: 10 }}
                />
                {dateStart && dateEnd && (
                  <>
                    {(!isEmpty(dataChart) && (
                      <>
                        {!isEmpty(dataProductId) &&
                        !isEmpty(dataProductGreen) &&
                        !isEmpty(dataProductName) &&
                        !isEmpty(dataProductTotal) ? (
                          <>
                            <Alert type="info">
                              Clique na área do gráfico correspondente ao
                              produto para ver os usuários que o colheram no
                              sistema
                            </Alert>

                            <Chart
                              type="pie"
                              title={`Período: ${dateConversor(
                                dateStart,
                                false
                              )} - ${dateConversor(dateEnd, false)}`}
                              dataLabels={dataProductName}
                              dataColors={theme.colors.chartHarvestsColors}
                              dataValues={dataProductTotal}
                              labelSuffix=" colheita(s)"
                              onClick={(...args) =>
                                handleSelectProduct(args[1])
                              }
                              dataLabelsActive
                              animation={chartAnimation}
                            />
                            {selectedProduct && (
                              <>
                                {(!isEmpty(dataChartProduct) && (
                                  <>
                                    {!isEmpty(dataSelectedProductName) && (
                                      <>
                                        <h4
                                          style={{
                                            textAlign: 'center',
                                            marginBottom: 10
                                          }}
                                        >
                                          Usuários que colheram o produto{' '}
                                          {dataSelectedProductName}
                                        </h4>
                                        <div className="table-responsive">
                                          <Table>
                                            <thead>
                                              <tr>
                                                <th>Produtor</th>
                                                <th>Quantidade</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {(dataChartProduct?.items &&
                                                dataChartProduct.items.map(
                                                  (d, i) => (
                                                    <tr key={String(i)}>
                                                      <td>{d.user}</td>
                                                      <td
                                                        style={{
                                                          textAlign: 'center'
                                                        }}
                                                      >
                                                        {d.total}
                                                      </td>
                                                    </tr>
                                                  )
                                                )) || (
                                                <tr>
                                                  <td colSpan="3">
                                                    Não há usuários com
                                                    colheitas desse produto
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
                                          totalPages={
                                            dataChartProduct?.meta?.totalPages
                                          }
                                        />
                                      </>
                                    )}
                                  </>
                                )) || <Loader />}
                              </>
                            )}
                          </>
                        ) : (
                          <Alert type="error">
                            Não há projeções de colheitas para o período
                            selecionado.
                          </Alert>
                        )}
                      </>
                    )) || <Loader />}
                  </>
                )}
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute([usersTypes[0]])(AdminProjecaoColheita);

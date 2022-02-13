import React, { useEffect, useState } from 'react';
import Head from 'next/head';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';

import Loader from '@/components/Loader';
import Error from '@/components/Error';
import { useFetch } from '@/hooks/useFetch';

import { Alert } from '@/components/Alert/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import { addOneDay, dateConversor } from '@/helpers/date';
import InputDateInterval from '@/components/InputDateInterval/index';
import Chart from '@/components/Chart/index';
import theme from '@/styles/theme';
import { colorShade } from '@/helpers/colors';
import usersTypes from '@/helpers/usersTypes';

function ControlProjecaoColheita() {
  const [alertMsg, setAlertMsg] = useState('');
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [dataProductId, setDataProductId] = useState([]);
  const [dataProductGreen, setDataProductGreen] = useState([]);
  const [dataProductName, setDataProductName] = useState([]);
  const [dataProductTotal, setDataProductTotal] = useState([]);

  const [dataSelectedProductDate, setDataSelectedProductDate] = useState([]);
  const [dataSelectedProductTotal, setDataSelectedProductTotal] = useState([]);
  const [dataSelectedProductIsGreen, setDataSelectedProductIsGreen] = useState(
    0
  );
  const [dataSelectedProductName, setDataSelectedProductName] = useState('');

  const [
    backgroundColorSelectedProduct,
    setBackgroundColorSelectedProduct
  ] = useState('#27AB8F');

  const [chartAnimation, setChartAnimation] = useState(true);

  const { data: dataChart, error: errorChart } = useFetch(
    dateStart && dateEnd
      ? `/charts/find/harvests-projection/by/user-logged?date_start=${dateStart}&date_finish=${dateEnd}`
      : null
  );

  const { data: dataChartProduct, errorChartProduct } = useFetch(
    dateStart && dateEnd && selectedProduct
      ? `/charts/find/harvests-date/by/product/${selectedProduct}/user-logged?date_start=${dateStart}&date_finish=${dateEnd}&is_green=${dataSelectedProductIsGreen}`
      : null
  );

  const handleChangeDateStart = date => setDateStart(date);

  const handleChangeDateEnd = date => setDateEnd(date);

  const handleSelectProduct = productActiveList => {
    if (!isEmpty(dataProductId) && !isEmpty(productActiveList)) {
      const [
        {
          index,
          element: {
            options: { backgroundColor }
          }
        }
      ] = productActiveList;

      setChartAnimation(false);
      setDataSelectedProductIsGreen(Number(dataProductGreen[index]));
      setDataSelectedProductName(dataProductName[index]);
      setSelectedProduct(dataProductId[index]);
      setBackgroundColorSelectedProduct(backgroundColor);
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

  useEffect(() => {
    if (!isEmpty(dataChartProduct)) {
      const { harvests_date: harvestsDate } = dataChartProduct;

      setDataSelectedProductDate([]);
      setDataSelectedProductTotal([]);

      harvestsDate.forEach(({ date, total }) => {
        const dateConversed = dateConversor(addOneDay(date), false);

        setDataSelectedProductDate(prevDataSelectedProductDate => [
          ...prevDataSelectedProductDate,
          dateConversed
        ]);
        setDataSelectedProductTotal(prevDataSelectedProductTotal => [
          ...prevDataSelectedProductTotal,
          total
        ]);
      });
    }
  }, [dataChartProduct]);

  if (errorChart || errorChartProduct)
    return <Error error={errorChart || errorChartProduct} />;

  return (
    <>
      <Head>
        <title>Gerenciar Projeção das Colheitas - Agro9</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent title="Gerenciar Projeção das Colheitas" />
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
                              produto para ver sua projeção de colheitas
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
                                    {!isEmpty(dataSelectedProductName) &&
                                      !isEmpty(dataSelectedProductDate) &&
                                      !isEmpty(dataSelectedProductTotal) &&
                                      !isEmpty(
                                        backgroundColorSelectedProduct
                                      ) && (
                                        <Chart
                                          type="line"
                                          title={`Projeção da Colheita de ${dataSelectedProductName}`}
                                          dataLabels={dataSelectedProductDate}
                                          dataColors={colorShade(
                                            backgroundColorSelectedProduct,
                                            -10,
                                            true,
                                            0.75
                                          )}
                                          dataBorderColor={
                                            backgroundColorSelectedProduct
                                          }
                                          dataValues={dataSelectedProductTotal}
                                          labelSuffix=" colheita(s)"
                                          legendActive={false}
                                        />
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

export default privateRoute([
  usersTypes[0],
  usersTypes[1],
  usersTypes[2],
  usersTypes[4]
])(ControlProjecaoColheita);

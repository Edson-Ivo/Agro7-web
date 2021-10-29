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
import { dateConversor } from '@/helpers/date';
import InputDateInterval from '@/components/InputDateInterval/index';
import Chart from '@/components/Chart/index';
import Table from '@/components/Table/index';
import maskString from '@/helpers/maskString';
import usersTypes from '@/helpers/usersTypes';

function ControlReceita() {
  const [alertMsg, setAlertMsg] = useState('');
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [dataProfits, setDataProfits] = useState(null);
  const [dataCosts, setDataCosts] = useState(null);
  const [dataCostsList, setDataCostsList] = useState([]);

  const { data: dataChart, error: errorChart } = useFetch(
    dateStart && dateEnd
      ? `/charts/find/revenue/by/user-logged?date_start=${dateStart}&date_finish=${dateEnd}`
      : null
  );

  const handleChangeDateStart = date => setDateStart(date);

  const handleChangeDateEnd = date => setDateEnd(date);

  useEffect(() => {
    if (!isEmpty(dataChart)) {
      const {
        total: {
          applications_supplies: applicationsSupplies,
          others,
          sales,
          services,
          durable_goods: durableGoods,
          consumable_goods: consumableGoods
        }
      } = dataChart;

      setDataProfits(sales);
      setDataCosts(
        Number(applicationsSupplies) +
          Number(others) +
          Number(services) +
          Number(durableGoods) +
          Number(consumableGoods)
      );
      setDataCostsList([
        applicationsSupplies,
        services,
        durableGoods,
        consumableGoods,
        others
      ]);
    }
  }, [dataChart]);

  if (errorChart) return <Error error={errorChart} />;

  return (
    <>
      <Head>
        <title>Gerenciar Receitas e Despesas - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent title="Gerenciar Receitas e Despesas" />
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
                {dateStart &&
                  dateEnd &&
                  dataProfits !== null &&
                  dataCosts !== null &&
                  !isEmpty(dataCostsList) && (
                    <>
                      {(!isEmpty(dataChart) && (
                        <>
                          {String(dataProfits) === '0' &&
                          String(dataCosts) === '0' ? (
                            <Alert type="error">
                              Não há dados para o período selecionado:{' '}
                              {dateConversor(dateStart, false)} -
                              {dateConversor(dateEnd, false)}.
                            </Alert>
                          ) : (
                            <div style={{ textAlign: 'center' }}>
                              <Chart
                                type="pie"
                                title={`Período: ${dateConversor(
                                  dateStart,
                                  false
                                )} - ${dateConversor(dateEnd, false)}`}
                                labelPrefix="R$ "
                                dataLabels={['Receita', 'Despesas']}
                                dataColors={['#3195BC', '#D5412D']}
                                dataValues={[dataProfits, dataCosts]}
                                dataLabelsActive
                              />
                              <Chart
                                type="bar"
                                title="Despesas detalhadas"
                                labelPrefix="R$ "
                                dataLabels={[
                                  'Aplicação de Insumos',
                                  'Serviços',
                                  'Bens Duráveis',
                                  'Bens Consumíveis',
                                  'Outros'
                                ]}
                                dataColors="#D5412D"
                                dataValues={[...dataCostsList]}
                                legendActive={false}
                              />
                              <Table noClick>
                                <thead>
                                  <tr>
                                    <th>Ação</th>
                                    <th>Despesa</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td style={{ textAlign: 'left' }}>
                                      Aplicação de Insumos
                                    </td>
                                    <td>
                                      {maskString(dataCostsList[0], 'money')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ textAlign: 'left' }}>
                                      Serviços
                                    </td>
                                    <td>
                                      {maskString(dataCostsList[1], 'money')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ textAlign: 'left' }}>
                                      Bens Duráveis
                                    </td>
                                    <td>
                                      {maskString(dataCostsList[2], 'money')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ textAlign: 'left' }}>
                                      Bens Consumíveis
                                    </td>
                                    <td>
                                      {maskString(dataCostsList[3], 'money')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ textAlign: 'left' }}>
                                      Outros
                                    </td>
                                    <td>
                                      {maskString(dataCostsList[4], 'money')}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
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
])(ControlReceita);

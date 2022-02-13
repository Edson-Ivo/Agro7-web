import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

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
import maskString from '@/helpers/maskString';
import Table from '@/components/Table/index';
import usersTypes from '@/helpers/usersTypes';

function UserReceita() {
  const router = useRouter();

  const [alertMsg, setAlertMsg] = useState('');
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [dataProfits, setDataProfits] = useState(null);
  const [dataCosts, setDataCosts] = useState(null);
  const [dataCostsList, setDataCostsList] = useState([]);

  const { id } = router.query;

  const { data: dataUser, error: errorUser } = useFetch(
    `/users/find/by/id/${id}`
  );

  const { data: dataChart, error: errorChart } = useFetch(
    dateStart && dateEnd
      ? `/charts/find/revenue/by/user/${id}?date_start=${dateStart}&date_finish=${dateEnd}`
      : null
  );

  const handleChangeDateStart = date => setDateStart(date);

  const handleChangeDateEnd = date => setDateEnd(date);

  useEffect(() => {
    if (!isEmpty(dataChart)) {
      const {
        total: {
          cultures_applications_supplies,
          cultures_others,
          cultures_services,
          fields_applications_supplies,
          fields_others,
          fields_services,
          properties_consumable_goods,
          properties_durable_goods,
          properties_others,
          properties_services,
          sales
        }
      } = dataChart;

      const applicationsSupplies =
        Number(cultures_applications_supplies) +
        Number(fields_applications_supplies);
      const services =
        Number(properties_services) +
        Number(cultures_services) +
        Number(fields_services);
      const durableGoods = Number(properties_consumable_goods);
      const consumableGoods = Number(properties_durable_goods);
      const others =
        Number(cultures_others) +
        Number(fields_others) +
        Number(properties_others);

      const costs =
        applicationsSupplies +
        services +
        durableGoods +
        consumableGoods +
        others;

      setDataProfits(sales);
      setDataCosts(costs);
      setDataCostsList([
        applicationsSupplies,
        services,
        durableGoods,
        consumableGoods,
        others
      ]);
    }
  }, [dataChart]);

  if (errorUser || errorChart) return <Error error={errorUser || errorChart} />;

  return (
    <>
      <Head>
        <title>
          Painel Administrativo | Gerenciar Receitas e Despesas - Agro9
        </title>
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
              title="Gerenciar Receitas e Despesas"
              description={`Aqui, você poderá gerenciar as receitas e despesas de ${dataUser?.name} no sistema.`}
              isLoading={isEmpty(dataUser)}
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
                  url={`/admin/users/${id}/receitas-despesas`}
                  onError={setAlertMsg}
                  onDateStartSelect={handleChangeDateStart}
                  onDateEndSelect={handleChangeDateEnd}
                  style={{ marginBottom: 10 }}
                />
                {dateStart && dateEnd && (
                  <>
                    {dataProfits !== null &&
                    dataCosts !== null &&
                    !isEmpty(dataCostsList) ? (
                      <>
                        {(!isEmpty(dataChart) && (
                          <>
                            {String(dataProfits) === '0' &&
                            String(dataCosts) === '0' ? (
                              <Alert type="error">
                                Não há dados para o período selecionado.
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
                    ) : (
                      <Loader />
                    )}
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

export default privateRoute([usersTypes[0]])(UserReceita);

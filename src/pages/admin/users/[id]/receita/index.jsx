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
          applications_supplies: applicationsSupplies,
          others,
          sales,
          services
        }
      } = dataChart;

      setDataProfits(sales);
      setDataCosts(
        Number(applicationsSupplies) + Number(others) + Number(services)
      );
      setDataCostsList([applicationsSupplies, services, others]);
    }
  }, [dataChart]);

  if (errorUser || errorChart) return <Error error={errorUser || errorChart} />;

  return (
    <>
      <Head>
        <title>Painel Administrativo | Gerenciar Receita - Agro7</title>
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
              title="Gerenciar Receita"
              description={`Aqui você poderá gerenciar a receita de ${dataUser?.name} no sistema.`}
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
                  url={`/admin/users/${id}/receita`}
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
                          {dataProfits !== '0' && dataCosts !== '0' ? (
                            <div style={{ textAlign: 'center' }}>
                              <Chart
                                type="pie"
                                title={`Período: ${dateConversor(
                                  dateStart,
                                  false
                                )} - ${dateConversor(dateEnd, false)}`}
                                labelPrefix="R$ "
                                dataLabels={['Ganhos', 'Despesas']}
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
                                  'Outros'
                                ]}
                                dataColors="#D5412D"
                                dataValues={[...dataCostsList]}
                                legendActive={false}
                              />
                            </div>
                          ) : (
                            <Alert type="error">
                              Não há receita para o período selecionado.
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

export default privateRoute(['administrador'])(UserReceita);

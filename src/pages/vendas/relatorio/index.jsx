import React, { useState } from 'react';
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
import PDFViewer from '@/components/PDFViewer/index';
import InputDateInterval from '@/components/InputDateInterval/index';
import usersTypes from '@/helpers/usersTypes';

function VendasRelatorio() {
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);

  const { data: dataReport, error: errorReport } = useFetch(
    dateStart && dateEnd
      ? `/sales/generate/report/by/user-logged?date_start=${dateStart}&date_finish=${dateEnd}`
      : null,
    true
  );

  const handleChangeDateStart = date => {
    setDateStart(date);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleChangeDateEnd = date => {
    setDateEnd(date);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  if (errorReport) return <Error error={errorReport} />;

  return (
    <>
      <Head>
        <title>Relatório de Vendas - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent title="Relatório de Vendas" />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(!dateStart || !dateEnd) && (
                  <Alert type="info">
                    Selecione o período que você deseja gerar o relatório
                    primeiro:
                  </Alert>
                )}
                {alertMsg && <Alert type="error">{alertMsg}</Alert>}
                <InputDateInterval
                  url="/vendas/relatorio"
                  onError={setAlertMsg}
                  onDateStartSelect={handleChangeDateStart}
                  onDateEndSelect={handleChangeDateEnd}
                  style={{ marginBottom: 10 }}
                />
                {dateStart && dateEnd && !loading && (
                  <>
                    {(!isEmpty(dataReport) && (
                      <PDFViewer
                        src={`${dataReport}`}
                        name="Relatório de Vendas"
                        pdfName={`Relatório de Vendas ${dateConversor(
                          dateStart,
                          false
                        )} - ${dateConversor(dateEnd, false)}.pdf`}
                        alertMessage="Se você não conseguir abrir ou visualizar o relatório, baixe-o no botão abaixo:"
                        downloadMessage="Baixar Relatório"
                        fitH
                      />
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
])(VendasRelatorio);

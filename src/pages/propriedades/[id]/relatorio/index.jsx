import React, { useState } from 'react';
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
import PDFViewer from '@/components/PDFViewer/index';
import useRewriteRoute from '@/hooks/useRewriteRoute';
import InputDateInterval from '@/components/InputDateInterval/index';
import usersTypes from '@/helpers/usersTypes';

function PropriedadesRelatorio() {
  const router = useRouter();
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);

  const route = useRewriteRoute(router, null, [usersTypes[3], usersTypes[4]]);

  const { id } = router.query;

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  const { data: dataReport, error: errorReport } = useFetch(
    dateStart && dateEnd
      ? `/properties/generate/report/by/id/${id}?date_start=${dateStart}&date_finish=${dateEnd}`
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

  if (error || errorReport) return <Error error={error || errorReport} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Relatório da Propriedade de {data && data.name} - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%propriedade': data?.name
              }}
              title={`Relatório da Propriedade de ${data?.name}`}
              description={`Aqui, você irá ver o relatório das ações da propriedade ${data?.name}.`}
              isLoading={isEmpty(data)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && (
                  <>
                    {(!dateStart || !dateEnd) && (
                      <Alert type="info">
                        Selecione o período que você deseja gerar o relatório
                        primeiro:
                      </Alert>
                    )}
                    {alertMsg && <Alert type="error">{alertMsg}</Alert>}
                    <InputDateInterval
                      url={`${route.path}/${id}/relatorio`}
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
                            name={`Relatório de Ações na Propriedade de ${data?.name}`}
                            pdfName={`Relatório de Ações na Propriedade de ${
                              data?.name
                            } ${dateConversor(
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

export default privateRoute()(PropriedadesRelatorio);

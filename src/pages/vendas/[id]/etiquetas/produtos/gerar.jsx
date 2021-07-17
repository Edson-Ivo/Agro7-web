import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { privateRoute } from '@/components/PrivateRoute';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import { useFetch } from '@/hooks/useFetch';
import Error from '@/components/Error/index';
import { CardContainer } from '@/components/CardContainer/index';
import Loader from '@/components/Loader/index';
import PDFViewer from '@/components/PDFViewer/index';

import isEmpty from '@/helpers/isEmpty';

function VendasEtiquetasProdutos() {
  const router = useRouter();

  const { id } = router.query;

  const { data: dataSale, error: errorSale } = useFetch(
    `/sales/find/by/id/${id}`
  );

  const { data: dataLabel, error: errorLabel } = useFetch(
    dataSale ? `/sales/generate/sale-label/by/id/${dataSale?.id}` : null,
    true
  );

  if (errorSale || errorLabel) return <Error error={errorSale || errorLabel} />;

  return (
    <>
      <Head>
        <title>
          Etiqueta sem Informações Nutricionais de Produto da Venda{' '}
          {dataSale && dataSale?.batch} - Agro7
        </title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%lote': dataSale?.batch
              }}
              title={`Etiqueta sem Informações Nutricionais de Produto da Venda ${dataSale?.batch}`}
              description={`Aqui você irá gerar uma etiqueta sem Informações Nutricionais de 25x40x4 para Produtos Embalados da Venda ${dataSale?.batch}.`}
              isLoading={isEmpty(dataSale)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(dataSale && dataLabel && (
                  <PDFViewer
                    src={`${dataLabel}`}
                    name="Etiqueta sem Informações Nutricionais de Produto"
                    pdfName={`Venda ${dataSale?.batch} - Etiqueta sem Informações Nutricionais de Produto.pdf`}
                    alertMessage="Se você não conseguir abrir ou visualizar a etiqueta, baixe-a no botão abaixo:"
                    downloadMessage="Baixar Etiqueta"
                    fitH
                  />
                )) || <Loader />}
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(VendasEtiquetasProdutos);

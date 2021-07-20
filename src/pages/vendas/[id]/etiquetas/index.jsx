import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons';

import { Card } from '@/components/Card/index';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { privateRoute } from '@/components/PrivateRoute';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import { useFetch } from '@/hooks/useFetch';
import Error from '@/components/Error/index';
import isEmpty from '@/helpers/isEmpty';
import useRewriteRoute from '@/hooks/useRewriteRoute';

const data = [
  {
    href: 'caixas',
    title: 'Caixas ou Sacarias',
    description:
      'Aqui você irá gerar uma etiqueta de 50x120x2 para Caixas ou Sacarias, inserindo a quantidade do produto que irá em cada caixa.',
    icon: faTags
  },
  {
    href: 'produtos/nutricional',
    title: 'Produtos Embalados (com Informações Nutricionais)',
    description:
      'Aqui você irá gerar uma etiqueta com Informações Nutricionais de 50x100x2 para Produtos Embalados, inserindo a quantidade do produto que irá em cada caixa.',
    icon: faTags
  },
  {
    href: 'produtos',
    title: 'Produtos Embalados (sem Informações Nutricionais)',
    description:
      'Aqui você irá gerar uma etiqueta sem Informações Nutricionais de 25x40x4 para Produtos Embalados, contendo apenas o Qr Code e código de rastreamento, lote e data.',
    icon: faTags
  }
];

function VendasEtiquetas() {
  const router = useRouter();

  const { path: routePath } = useRewriteRoute(router);

  const { id } = router.query;

  const { data: dataSale, error: errorSale } = useFetch(
    `/sales/find/by/id/${id}`
  );

  if (errorSale) return <Error error={errorSale} />;

  return (
    <>
      <Head>
        <title>Etiquetas da Venda {dataSale && dataSale?.batch} - Agro7</title>
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
              title={`Etiquetas da Venda ${dataSale?.batch}`}
              description="Selecione nas opções abaixo a etiqueta que você quer gerar para essa venda."
              isLoading={isEmpty(dataSale)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              {data.map(({ href, title, description, icon }, i) => (
                <Link
                  href={`${routePath}/${id}/etiquetas/${href}/gerar`}
                  key={i.toString()}
                >
                  <Card height="90px" isLight responsiveImage>
                    <div className="card-info">
                      <h4>Etiquetas para {title}</h4>
                      <p>{description}</p>
                    </div>
                    <div className="card-image">
                      <FontAwesomeIcon icon={icon} className="card-icon" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(VendasEtiquetas);

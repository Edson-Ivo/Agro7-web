import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faShareAlt,
  faChevronDown,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

import { MapActionGetLatLng } from '@/components/MapApp';
import Carousel from '@/components/Carousel';
import { CardContentButton } from '@/components/CardContentButton';
import { SectionDate } from '@/components/SectionDate';
import Error from '@/components/Error';
import Loader from '@/components/Loader';
import ReadMore from '@/components/ReadMore';

import {
  Container,
  Header,
  Content,
  HeaderLogo,
  CardContainer,
  CardImage,
  CardContent,
  CardContentButtons,
  HeaderMoreInfo,
  Section,
  SectionNutritionalTable
} from '@/styles/pages/rastreamento/styles';

import useWebShareApi from '@/hooks/useWebShareApi';
import { api } from '@/services/api';
import isEmpty from '@/helpers/isEmpty';
import { dateConversor } from '@/helpers/date';
import truncate from '@/helpers/truncate';

export default function Rastreamento({ sale }) {
  const router = useRouter();
  const moreInfoRef = useRef(null);
  const [isSupported, share] = useWebShareApi();

  if (router.isFallback)
    return (
      <>
        <Head>
          <title>Rastreamento - Agro7</title>
        </Head>

        <div
          style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Loader />
        </div>
      </>
    );

  if (!sale)
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <Error error={404} />
      </>
    );

  return (
    <>
      <Head>
        <title>Rastreamento - Agro7</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Container>
        <Header>
          <Content style={{ marginBottom: 64 }}>
            <HeaderLogo>
              <Link href="/">
                <a>
                  <Image
                    src="/assets/images/logo-rastreio.png"
                    alt="Agro7 Tecnologia, Gestão e Rastreabilidade, clique aqui e conheça nosso Projeto."
                    width={336}
                    height={71}
                  />
                </a>
              </Link>
              <h5 className="tracking-message">
                Este é um produto de origem rastreada
              </h5>
            </HeaderLogo>
            <CardContainer>
              <CardImage>
                <Image
                  src={
                    sale?.harvests_sales?.[0]?.harvests?.cultures?.products?.url
                  }
                  alt={`Imagem do Produto ${sale?.harvests_sales?.[0]?.harvests?.cultures?.products?.name}`}
                  width={240}
                  height={240}
                />
              </CardImage>
              <CardContent>
                <div className="card__header">
                  <h5>
                    {
                      sale?.harvests_sales?.[0]?.harvests?.cultures?.products
                        ?.name
                    }{' '}
                    (lote {sale?.batch})
                  </h5>
                  <h1>
                    {
                      sale?.harvests_sales?.[0]?.harvests?.cultures?.products
                        ?.name
                    }
                  </h1>
                </div>
                <div className="card__body">
                  <p className="card__body__description">
                    <ReadMore>
                      {
                        sale?.harvests_sales?.[0]?.harvests?.cultures?.products
                          ?.description
                      }
                    </ReadMore>
                  </p>
                  <CardContentButtons>
                    <CardContentButton
                      title="Propriedade"
                      description={
                        sale?.harvests_sales?.[0]?.harvests?.cultures?.fields
                          ?.properties?.name
                      }
                      faIcon={faMapMarkerAlt}
                    />
                    <CardContentButton
                      title="Produtor"
                      description={
                        sale?.harvests_sales?.[0]?.harvests?.cultures?.fields
                          ?.properties?.users?.name
                      }
                      imageSrc="/assets/producer-placeholder.png"
                      linkTo={`/produtor/${sale?.harvests_sales?.[0]?.harvests?.cultures?.fields?.properties?.users?.id}`}
                    />
                    {isSupported && (
                      <CardContentButton
                        title="Compartilhar"
                        faIcon={faShareAlt}
                        onClick={() =>
                          share(
                            `Rastreamento do Produto ${sale?.harvests_sales?.[0]?.harvests?.cultures?.products?.name}`,
                            `Rastreamento do Produto ${sale?.harvests_sales?.[0]?.harvests?.cultures?.products?.name} no lote ${sale?.batch}`
                          )
                        }
                      />
                    )}
                  </CardContentButtons>
                </div>
              </CardContent>
            </CardContainer>
          </Content>
          <HeaderMoreInfo
            role="button"
            tabIndex={0}
            onClick={() =>
              moreInfoRef.current.scrollIntoView({ behavior: 'smooth' })
            }
          >
            <h5>
              Veja mais Informações desse lote{' '}
              <FontAwesomeIcon icon={faChevronDown} />
            </h5>
          </HeaderMoreInfo>
        </Header>
        <Section ref={moreInfoRef}>
          <Content>
            <h2>Tabela Nutricional:</h2>
            <SectionNutritionalTable>
              {(sale?.nutritionalTableImage && (
                <Image
                  src={sale?.nutritionalTableImage}
                  alt="Tabela Nutricional do Produto"
                  width={540}
                  height={700}
                />
              )) || <h4>Produto informado sem tabela nutricional.</h4>}
            </SectionNutritionalTable>
          </Content>
        </Section>
        <Section alternative>
          <Content>
            <h2>Datas:</h2>
            <Carousel>
              {sale?.harvests_sales.map(
                ({ harvests: { date, forecast } }, i) => (
                  <div key={String(i)}>
                    <h3 style={{ marginBottom: '32px' }}>
                      COLHEITA {String(i + 1)}
                    </h3>
                    <SectionDate
                      plantDate={dateConversor(date, false)}
                      harvestDate={dateConversor(forecast, false)}
                      transportDate={dateConversor(sale?.created_at, false)}
                    />
                  </div>
                )
              )}
            </Carousel>
          </Content>
        </Section>
        <Section>
          <Content>
            <h2>
              Propriedade: <br />
              {
                sale?.harvests_sales?.[0]?.harvests?.cultures?.fields
                  ?.properties?.name
              }
            </h2>
            <MapActionGetLatLng
              positions={[
                sale?.harvests_sales?.[0]?.harvests?.cultures?.fields
                  ?.properties?.coordinates?.latitude,
                sale?.harvests_sales?.[0]?.harvests?.cultures?.fields
                  ?.properties?.coordinates?.longitude
              ]}
              zoom={16}
            />
          </Content>
        </Section>
        <Section alternative>
          <Content>
            <h2>Produtor:</h2>
            <CardContainer alternative>
              <CardImage>
                <Image
                  src={
                    sale?.harvests_sales?.[0]?.harvests?.cultures?.fields
                      ?.properties?.users?.profiles?.image_url ||
                    '/assets/user-placeholder.png'
                  }
                  alt={`Imagem do Produtor ${sale?.harvests_sales?.[0]?.harvests?.cultures?.fields?.properties?.users?.name}`}
                  width={240}
                  height={240}
                />
              </CardImage>
              <CardContent>
                <div className="card__header">
                  <h1>
                    {
                      sale?.harvests_sales?.[0]?.harvests?.cultures?.fields
                        ?.properties?.users?.name
                    }
                  </h1>
                </div>
                <div className="card__body">
                  <p className="card__body__description">
                    {truncate(
                      sale?.harvests_sales?.[0]?.harvests?.cultures?.fields
                        ?.properties?.users?.profiles?.about,
                      230
                    ) || 'Esse produtor ainda não colocou uma descrição.'}
                  </p>
                  <CardContentButtons center>
                    <CardContentButton
                      title="Perfil do Produtor"
                      description="Clique para ver mais"
                      faIcon={faPlus}
                      linkTo={`/produtor/${sale?.harvests_sales?.[0]?.harvests?.cultures?.fields?.properties?.users?.id}`}
                    />
                  </CardContentButtons>
                </div>
              </CardContent>
            </CardContainer>
          </Content>
        </Section>
      </Container>
    </>
  );
}

export const getStaticPaths = () => ({
  paths: [],
  fallback: true
});

export const getStaticProps = async ctx => {
  const { code } = ctx.params;
  const url = `/sales/find/by/code/${code}`;

  let sale = null;
  let notFound = false;

  try {
    const response = await api.get(url);
    let newData = response.data;

    const nutritional =
      newData?.harvests_sales?.[0]?.harvests?.cultures?.products?.nutritional;

    if (!isEmpty(nutritional)) {
      const nutritionalTable = nutritional.find(n => !n.is_green);

      if (!isEmpty(nutritionalTable)) {
        const nutritionalTableImage =
          nutritionalTable?.nutritional_images?.url || '';
        newData = { ...newData, nutritionalTableImage };
      }
    }

    sale = newData;
  } catch (err) {
    notFound = true;
  }

  return {
    props: {
      sale
    },
    revalidate: 300,
    notFound
  };
};

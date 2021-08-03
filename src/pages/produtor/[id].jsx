import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { MapActionGetLatLng } from '@/components/MapApp';
import Carousel from '@/components/Carousel';
import Error from '@/components/Error';
import Loader from '@/components/Loader';

import {
  Container,
  Header,
  Content,
  HeaderLogo,
  CardContainer,
  CardImage,
  CardContent,
  ContentDivided,
  HeaderMoreInfo,
  Section,
  GalleryImage
} from '@/styles/pages/rastreamento/styles';

import { api } from '@/services/api';
import isEmpty from '@/helpers/isEmpty';
import extractYoutubeVideoID from '@/helpers/extractYoutubeVideoID';
import YoutubeEmbed from '@/components/YoutubeEmbed/index';

export default function Produtor({ profile }) {
  const router = useRouter();
  const moreInfoRef = useRef(null);

  if (router.isFallback)
    return (
      <>
        <Head>
          <title>Produtor - Agro7</title>
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

  if (!profile)
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
        <title>Produtor - Agro7</title>
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
              <h5 className="tracking-message" style={{ marginTop: 16 }}>
                <Image
                  src="/assets/images/origem.png"
                  alt={`Este produto tem a origem de ${profile?.name}`}
                  width={560}
                  height={51}
                />
              </h5>
            </HeaderLogo>
            <CardContainer verticalAlign>
              <CardImage verticalAlign>
                <Image
                  src={
                    profile?.profiles?.image_url ||
                    '/assets/user-placeholder.png'
                  }
                  alt={`Foto do Produto ${profile?.name}`}
                  width={160}
                  height={160}
                />
              </CardImage>
              <CardContent>
                <div className="card__header centered">
                  <h1>{profile?.name}</h1>
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
              Veja mais informações <FontAwesomeIcon icon={faChevronDown} />
            </h5>
          </HeaderMoreInfo>
        </Header>
        <Section ref={moreInfoRef}>
          <Content>
            <ContentDivided>
              <div>
                <h2>Sobre mim:</h2>
                <p>
                  {profile?.profiles?.about ||
                    'Esse produtor ainda não colocou uma descrição.'}
                </p>
              </div>
              {!isEmpty(profile?.embedId) && (
                <div>
                  <YoutubeEmbed
                    embedId={profile?.embedId}
                    name="youtube_video"
                    title={`Vídeo de sobre do produtor ${profile?.name}`}
                  />
                </div>
              )}
            </ContentDivided>
          </Content>
        </Section>
        <Section alternative>
          <Content>
            <h2>
              Este produtor possui {Number(profile?.properties?.length)}{' '}
              propriedades:
            </h2>
            <Carousel draggable={false}>
              {profile?.properties.map(
                ({ name, coordinates: { latitude, longitude } }, i) => (
                  <div key={String(i)}>
                    <h3 style={{ marginBottom: '32px' }}>Propriedade {name}</h3>
                    <div style={{ width: '85%', margin: '0 auto' }}>
                      <MapActionGetLatLng
                        positions={[latitude, longitude]}
                        zoom={16}
                      />
                    </div>
                  </div>
                )
              )}
            </Carousel>
          </Content>
        </Section>
        <Section>
          <Content>
            <h2>Galeria de fotos:</h2>
            {(!isEmpty(profile?.profiles?.gallery) && (
              <Carousel
                slidesToShow={3}
                responsive={[
                  {
                    breakpoint: 1150,
                    settings: {
                      slidesToShow: 1
                    }
                  }
                ]}
              >
                {profile?.profiles?.gallery.map(
                  ({ image_url: imageUrl }, i) => (
                    <div key={String(i)}>
                      <GalleryImage>
                        <Image
                          src={imageUrl}
                          width={566}
                          height={372}
                          alt={`Imagem ${i} da galeria de fotos deste produtor`}
                        />
                      </GalleryImage>
                    </div>
                  )
                )}
              </Carousel>
            )) || (
              <h4>Esse produtor ainda não inseriu fotos para sua galeria.</h4>
            )}
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
  const { id } = ctx.params;
  const url = `/users/find-to-user/by/id/${id}`;

  let profile = null;
  let notFound = false;

  try {
    const response = await api.get(url);
    let newData = response.data;

    if (!isEmpty(newData?.profiles?.video_url)) {
      const embedId = extractYoutubeVideoID(newData?.profiles?.video_url);
      newData = { ...newData, embedId };
    }

    profile = newData;
  } catch (err) {
    notFound = true;
  }

  return {
    props: {
      profile
    },
    revalidate: 300,
    notFound
  };
};

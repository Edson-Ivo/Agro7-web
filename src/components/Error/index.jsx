import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import Container, { CenterContainer } from '../Container';

import Button from '../Button';

const dataErrors = {
  401: {
    title: 'Você não está autenticado...',
    description:
      'Desculpe, mas parece que você não está autenticado em nossa aplicação. Por favor, faça login.',
    link: '/login',
    text: 'Fazer login'
  },
  403: {
    title: 'Não encontramos essa página...',
    description:
      'Desculpe, essa página que você tentou acessar não existe ou está bloqueada, aconselhamos você voltar para a página inicial.'
  },
  404: {
    title: 'Não encontramos essa página...',
    description:
      'Desculpe, essa página que você tentou acessar não existe ou está bloqueada, aconselhamos você voltar para a página inicial.'
  },
  default: {
    title: 'Algo deu errado...',
    description: 'Aconteceu algum erro, vamos tentar novamente.'
  }
};

export default function Error({ error }) {
  const [dataError, setDataError] = useState(null);

  const errorExists = errorValue => errorValue in dataErrors;

  useEffect(() => {
    const catchedError =
      typeof error === 'object' ? error?.response?.data?.statusCode : error;

    setDataError(
      errorExists(catchedError) ? dataErrors[catchedError] : dataErrors.default
    );
  }, []);

  return (
    <>
      <Head>
        <title>{dataError?.title} - Agro7</title>
      </Head>
      <Container>
        <CenterContainer>
          <div className="CenterContainer__content">
            <div className="logoContainer">
              <Image
                src="/logo/logo.png"
                width="210"
                height="90"
                loading="eager"
                alt="Logotipo Agro7"
                priority
              />
            </div>
            {dataError && (
              <>
                <h3 style={{ marginBottom: '20px' }}>{dataError.title}</h3>
                <p className="text">{dataError.description}</p>
                <div style={{ marginTop: '20px' }}>
                  <Link href={dataError?.link ? dataError.link : '/'}>
                    <a>
                      <Button type="button" className="primary loginButton">
                        <FontAwesomeIcon
                          icon={faSignInAlt}
                          className="loginIcon"
                        />{' '}
                        {dataError?.text
                          ? dataError.text
                          : 'Voltar para página inicial'}
                      </Button>
                    </a>
                  </Link>
                </div>
              </>
            )}
          </div>
        </CenterContainer>
      </Container>
    </>
  );
}

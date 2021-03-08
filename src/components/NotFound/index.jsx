import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import Container, { CenterContainer } from '../Container';

import Button from '../Button';

export default function NotFound() {
  return (
    <>
      <Container>
        <CenterContainer>
          <div className="CenterContainer__content">
            <div className="logoContainer">
              <Image src="/logo/logo.png" width="210" height="90" />
            </div>
            <h3 style={{ marginBottom: '20px' }}>
              Não encontramos essa página...
            </h3>
            <p className="text">
              Desculpe, essa página que você tentou acessar não existe ou está
              bloqueada, aconselhamos você voltar para a página principal.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link href="/">
                <Button className="primary loginButton">
                  <FontAwesomeIcon icon={faSignInAlt} className="loginIcon" />{' '}
                  Voltar para página principal
                </Button>
              </Link>
            </div>
          </div>
        </CenterContainer>
      </Container>
    </>
  );
}

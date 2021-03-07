import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import Container, { CenterContainer } from '../Container';

import Button from '../Button';

export default function Error() {
  return (
    <>
      <Container>
        <CenterContainer>
          <div className="CenterContainer__content">
            <div className="logoContainer">
              <Image src="/logo/logo.png" width="210" height="90" />
            </div>
            <h3>Algo deu errado...</h3>
            <p className="text">
              Aconteceu algum erro, vamos tentar novamente.
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

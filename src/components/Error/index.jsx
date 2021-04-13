import React from 'react';
import Image from 'next/image';

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
              <Image
                src="/logo/logo.png"
                width="210"
                height="90"
                alt="Logotipo Agro7"
              />
            </div>
            <h3 style={{ marginBottom: '20px' }}>Algo deu errado...</h3>
            <p className="text">
              Aconteceu algum erro, vamos tentar novamente.
            </p>
            <div style={{ marginTop: '20px' }}>
              <a href="/">
                <Button className="primary loginButton">
                  <FontAwesomeIcon icon={faSignInAlt} className="loginIcon" />{' '}
                  Voltar para página principal
                </Button>
              </a>
            </div>
          </div>
        </CenterContainer>
      </Container>
    </>
  );
}

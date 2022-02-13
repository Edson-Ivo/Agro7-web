import React from 'react';
import Image from 'next/image';

import Container, { CenterContainer } from '../Container';
import Loader from './index';

export default function LogoLoader() {
  return (
    <>
      <Container>
        <CenterContainer>
          <div>
            <div style={{ marginBottom: 32 }}>
              <Image
                src="/logo/logo.png"
                width="210"
                height="90"
                loading="eager"
                alt="Logotipo Agro9"
                priority
              />
            </div>

            <Loader />
          </div>
        </CenterContainer>
      </Container>
    </>
  );
}

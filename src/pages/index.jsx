import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';

import { Card } from '@/components/Card/index';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { privateRoute } from '@/components/PrivateRoute';
import { greetings } from '@/helpers/greetings';

function Home() {
  const { name } = useSelector(state => state.user);
  const greeting = greetings();

  return (
    <>
      <Head>
        <title>Página Inicial - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              <Breadcrumb path={[{ route: '/', name: 'Home' }]} />
              <h2>
                {greeting}
                {name}!
              </h2>
              <p>
                Navegue por suas funcionalidades abaixo ou pelas abas ao lado.
              </p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <Link href="/propriedades">
                <Card fontColor="black" height="90px">
                  <div className="card-info">
                    <h4>Gerenciar Propriedades</h4>
                    <p>Aqui você pode gerenciar suas propriedades.</p>
                  </div>
                  <div className="card-image">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="card-icon"
                    />
                  </div>
                </Card>
              </Link>
              <Link href="/configuracoes">
                <Card fontColor="black" height="90px">
                  <div className="card-info">
                    <h4>Meus Dados</h4>
                    <p>Gerencie ou edite seus dados aqui.</p>
                  </div>
                  <div className="card-image">
                    <FontAwesomeIcon icon={faCog} className="card-icon" />
                  </div>
                </Card>
              </Link>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(Home);

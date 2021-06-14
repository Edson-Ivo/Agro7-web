import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faBook,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';

import { Card } from '@/components/Card/index';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { privateRoute } from '@/components/PrivateRoute';
import { greetings } from '@/helpers/greetings';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

const data = [
  {
    href: '/propriedades',
    title: 'Gerenciar Propriedades',
    description: 'Aqui você pode gerenciar suas propriedades.',
    icon: faMapMarkerAlt
  },
  {
    href: '/caderno-produtor',
    title: 'Caderno do Produtor',
    description: 'Gerencie ou edite suas anotações do caderno do produtor.',
    icon: faBook
  },
  {
    href: '/configuracoes',
    title: 'Meus Dados',
    description: 'Gerencie ou edite seus dados aqui.',
    icon: faCog
  }
];

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
            <SectionHeaderContent
              breadcrumb={[{ route: '/', name: 'Home' }]}
              title={`${greeting} ${name}!`}
              description="Navegue por suas funcionalidades abaixo ou pelas abas ao lado."
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              {data.map(({ href, title, description, icon }, i) => (
                <Link href={href} key={i.toString()}>
                  <Card height="90px" isLight>
                    <div className="card-info">
                      <h4>{title}</h4>
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

export default privateRoute()(Home);

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faBell } from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';

import { Card } from '@/components/Card/index';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { privateRoute } from '@/components/PrivateRoute';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

const data = [
  {
    href: '/tecnico/propriedades',
    title: 'Propriedades Relacionadas',
    description:
      'Aqui você irá ver todas as propriedades que estão relacionadas com seu usuário de técnico.',
    icon: faMapMarkedAlt
  },
  {
    href: '/tecnico/solicitacoes',
    title: 'Solicitação Técnica',
    description:
      'Aqui você irá gerenciar todas as solicitações técnicas de propriedades.',
    icon: faBell
  }
];

function TechnichianHome() {
  const { name } = useSelector(state => state.user);

  return (
    <>
      <Head>
        <title>Painel Técnico - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumb={[
                { route: '/', name: 'Home' },
                { route: '/tecnico', name: 'Painel Técnico' }
              ]}
              title="Painel Técnico"
              description={`Olá ${name}! Esse é seu painel de técnico, aqui você pode
                gerenciar suas solicitações para trabalhar em uma propriedade,
                como também, gerenciar as propriedades que você já está
                relacionado!`}
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

export default privateRoute(['tecnico'])(TechnichianHome);

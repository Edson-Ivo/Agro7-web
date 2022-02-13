import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faBook,
  faMapMarkerAlt,
  faDollarSign,
  faUser,
  faChartPie,
  faUserSecret,
  faUserCog
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
import usersTypes from '@/helpers/usersTypes';

const data = [
  {
    href: '/painel-controle',
    title: 'Painel de Controle',
    description:
      'Gerencie suas receitas, despesas e suas projeções de colheitas em um período de tempo.',
    icon: faChartPie,
    typeBlock: [usersTypes[3]]
  },
  {
    href: '/tecnico',
    title: 'Painel Técnico',
    description:
      'Gerencie suas solicitações para trabalhar em uma propriedade, como também, as propriedades em que você já está relacionado.',
    icon: faUserSecret,
    typeAccess: [usersTypes[3], usersTypes[4]]
  },
  {
    href: '/admin',
    title: 'Painel Administrativo',
    description: 'Gerencie toda sua aplicação aqui.',
    icon: faUserCog,
    typeAccess: [usersTypes[0]]
  },
  {
    href: '/propriedades',
    title: 'Suas Propriedades',
    description: 'Gerencie ou edite suas propriedades e relacionados.',
    icon: faMapMarkerAlt,
    typeBlock: [usersTypes[3]]
  },
  {
    href: '/vendas',
    title: 'Suas Vendas',
    description: 'Gerencie e realize suas vendas e relacionados.',
    icon: faDollarSign,
    typeBlock: [usersTypes[3]]
  },
  {
    href: '/caderno-produtor',
    title: 'Caderno do Produtor',
    description: 'Gerencie ou edite suas anotações do caderno do produtor.',
    icon: faBook
  },
  {
    href: '/configuracoes/perfil',
    title: 'Meu Perfil',
    description: 'Gerencie ou edite seu perfil aqui.',
    icon: faUser
  },
  {
    href: '/configuracoes',
    title: 'Meus Dados',
    description: 'Gerencie ou edite seus dados aqui.',
    icon: faCog
  }
];

function Home() {
  const { name, type } = useSelector(state => state.user);
  const greeting = greetings();

  return (
    <>
      <Head>
        <title>Página Inicial - Agro9</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title={`${greeting}, ${name}!`}
              description="Navegue pelas suas funcionalidades abaixo ou pelas abas ao lado."
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              {data.map(
                (
                  {
                    href,
                    title,
                    description,
                    icon,
                    typeAccess = null,
                    typeBlock = null
                  },
                  i
                ) => (
                  <div key={i.toString()}>
                    {(typeAccess === null || typeAccess.includes(type)) &&
                    (typeBlock === null || !typeBlock.includes(type)) ? (
                      <Link href={href}>
                        <Card height="90px" isLight>
                          <div className="card-info">
                            <h4>{title}</h4>
                            <p>{description}</p>
                          </div>
                          <div className="card-image">
                            <FontAwesomeIcon
                              icon={icon}
                              className="card-icon"
                            />
                          </div>
                        </Card>
                      </Link>
                    ) : null}
                  </div>
                )
              )}
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(Home);

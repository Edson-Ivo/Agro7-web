import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faSeedling } from '@fortawesome/free-solid-svg-icons';

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
    href: '/painel-controle/receita',
    title: 'Gerenciar Receita',
    description:
      'Aqui, você poderá checar a sua receita (ganhos e despesas) em determinado período de tempo.',
    icon: faWallet
  },
  {
    href: '/painel-controle/projecao-colheita',
    title: 'Gerenciar Projeções das Colheitas',
    description:
      'Aqui, você poderá checar a projeção de suas colheitas em determinado período de tempo.',
    icon: faSeedling
  }
];

function ControlPanel() {
  const { name } = useSelector(state => state.user);

  return (
    <>
      <Head>
        <title>Painel de Controle - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title="Painel de Controle"
              description={`Olá, ${name}! Esse é seu painel de controle. Aqui, você pode gerenciar suas receitas e as projeções das suas colheitas.`}
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

export default privateRoute()(ControlPanel);

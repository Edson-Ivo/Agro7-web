import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMapMarkerAlt,
  faBox,
  faPaintRoller,
  faListUl,
  faDollarSign,
  faTruck,
  faStore,
  faWallet,
  faSeedling,
  faUserLock
} from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';

import { Card } from '@/components/Card/index';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { privateRoute } from '@/components/PrivateRoute';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import usersTypes from '@/helpers/usersTypes';

const data = [
  {
    href: '/admin/users',
    title: 'Gerenciar Usuários',
    description:
      'Aqui, você tem controle de todos os usuários ativados da sua aplicação.',
    icon: faUser
  },
  {
    href: '/admin/users/nao-ativado',
    title: 'Gerenciar Usuários Não Ativados',
    description:
      'Aqui, você tem controle de todos os usuários não ativados da sua aplicação.',
    icon: faUserLock
  },
  {
    href: '/admin/propriedades',
    title: 'Gerenciar Propriedades',
    description: 'Aqui, você pode gerenciar as propriedades de sua aplicação.',
    icon: faMapMarkerAlt
  },
  {
    href: '/admin/produtos',
    title: 'Gerenciar Produtos',
    description:
      'Aqui, você tem controle de todos os produtos de sua aplicação.',
    icon: faBox
  },
  {
    href: '/admin/vendas',
    title: 'Gerenciar Vendas',
    description: 'Aqui, você tem controle de todas as vendas de sua aplicação.',
    icon: faDollarSign
  },
  {
    href: '/admin/receitas-despesas',
    title: 'Gerenciar Receitas e Despesas',
    description:
      'Aqui, você poderá checar as receitas e as despesas gerais dos usuários do sistema em determinado um período de tempo.',
    icon: faWallet
  },
  {
    href: '/admin/projecao-colheita',
    title: 'Gerenciar Projeções das Colheitas',
    description:
      'Aqui, você poderá checar a projeção das colheitas geral dos usuários do sistema em determinado um período de tempo.',
    icon: faSeedling
  },
  {
    href: '/admin/vendas/distribuidoras',
    title: 'Gerenciar Distribuidoras',
    description:
      'Aqui, você tem controle de todas as distribuidoras de sua aplicação.',
    icon: faStore
  },
  {
    href: '/admin/vendas/transportadoras',
    title: 'Gerenciar Transportadoras',
    description:
      'Aqui, você tem controle de todas as transportadoras de sua aplicação.',
    icon: faTruck
  },
  {
    href: '/admin/categorias',
    title: 'Gerenciar Categorias',
    description:
      'Aqui, você tem controle de todas as categorias de sua aplicação.',
    icon: faListUl
  },
  {
    href: '/admin/cores',
    title: 'Gerenciar Cores',
    description:
      'Aqui, você tem controle de todas as cores para categorias de sua aplicação.',
    icon: faPaintRoller
  }
];

function AdminHome() {
  const { name } = useSelector(state => state.user);

  return (
    <>
      <Head>
        <title>Painel Administrativo - Agro9</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title="Painel Administrativo"
              description={`Olá ${name}! Esse é seu painel, aqui você pode gerenciar o
                controle de sua aplicação!`}
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

export default privateRoute([usersTypes[0]])(AdminHome);

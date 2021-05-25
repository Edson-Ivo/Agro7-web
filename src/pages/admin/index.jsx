import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMapMarkerAlt,
  faBox,
  faPaintRoller,
  faListUl
} from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';

import { Card } from '@/components/Card/index';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { privateRoute } from '@/components/PrivateRoute';

const data = [
  {
    href: '/admin/users',
    title: 'Gerenciar Usuários',
    description:
      'Aqui você tem controle de todos os usuários da sua aplicação.',
    icon: faUser
  },
  {
    href: '/admin/propriedades',
    title: 'Gerenciar Propriedades',
    description: 'Aqui você pode gerenciar as propriedades de sua aplicação.',
    icon: faMapMarkerAlt
  },
  {
    href: '/admin/produtos',
    title: 'Gerenciar Produtos',
    description:
      'Aqui você tem controle de todos os produtos de sua aplicação.',
    icon: faBox
  },
  {
    href: '/admin/categorias',
    title: 'Gerenciar Categorias',
    description:
      'Aqui você tem controle de todas as categorias de sua aplicação.',
    icon: faListUl
  },
  {
    href: '/admin/cores',
    title: 'Gerenciar Cores',
    description:
      'Aqui você tem controle de todas as cores para categorias de sua aplicação.',
    icon: faPaintRoller
  }
];

function AdminHome() {
  const { name } = useSelector(state => state.user);

  return (
    <>
      <Head>
        <title>Painel Adminstrativo - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              <Breadcrumb
                path={[
                  { route: '/', name: 'Home' },
                  { route: '/admin', name: 'Painel Adminstrativo' }
                ]}
              />
              <h2>Painel Adminstrativo</h2>
              <p>
                Olá {name}! Esse é seu painel, aqui você pode gerenciar o
                controle de sua aplicação!
              </p>
            </div>
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

export default privateRoute(['administrator'])(AdminHome);

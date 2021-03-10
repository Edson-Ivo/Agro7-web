import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { useSelector } from 'react-redux';

import { Card } from '@/components/Card/index';
import Container from '../../components/Container';
import Nav from '../../components/Nav';
import Navbar from '../../components/Navbar';
import Breadcrumb from '../../components/Breadcrumb';
import { Section, SectionHeader, SectionBody } from '../../components/Section';

import { CardContainer } from '../../components/CardContainer';
import { privateRoute } from '../../components/PrivateRoute';
import NotFound from '../../components/NotFound';

function AdminHome({ permission }) {
  if (!permission) return <NotFound />;
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
              <Link href="/admin/users">
                <Card fontColor="black" height="90px">
                  <div className="card-info">
                    <h4>Teste</h4>
                    <p>teste</p>
                  </div>
                  <div className="card-image" />
                </Card>
              </Link>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute(['administrator'])(AdminHome);

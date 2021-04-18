import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMapMarkerAlt,
  faBox,
  faPaintRoller,
  faStickyNote
} from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';

import { Card } from '@/components/Card/index';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { privateRoute } from '@/components/PrivateRoute';
import NotFound from '@/components/NotFound';

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
                    <h4>Gerenciar Usuários</h4>
                    <p>
                      Aqui você tem controle de todos os usuários da sua
                      aplicação.
                    </p>
                  </div>
                  <div className="card-image">
                    <FontAwesomeIcon icon={faUser} className="card-icon" />
                  </div>
                </Card>
              </Link>
              <Link href="/admin/propriedades">
                <Card fontColor="black" height="90px">
                  <div className="card-info">
                    <h4>Gerenciar Propriedades</h4>
                    <p>
                      Aqui você tem controle de todos as propriedades da sua
                      aplicação.
                    </p>
                  </div>
                  <div className="card-image">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="card-icon"
                    />
                  </div>
                </Card>
              </Link>
              <Link href="/admin/produtos">
                <Card fontColor="black" height="90px">
                  <div className="card-info">
                    <h4>Gerenciar Produtos</h4>
                    <p>
                      Aqui você tem controle de todos os produtos de sua
                      aplicação.
                    </p>
                  </div>
                  <div className="card-image">
                    <FontAwesomeIcon icon={faBox} className="card-icon" />
                  </div>
                </Card>
              </Link>
              <Link href="/admin/cores">
                <Card fontColor="black" height="90px">
                  <div className="card-info">
                    <h4>Gerenciar Cores</h4>
                    <p>
                      Aqui você tem controle de todas as cores para categorias
                      de sua aplicação
                    </p>
                  </div>
                  <div className="card-image">
                    <FontAwesomeIcon
                      icon={faPaintRoller}
                      className="card-icon"
                    />
                  </div>
                </Card>
              </Link>
              <Link href="/admin/icones">
                <Card fontColor="black" height="90px">
                  <div className="card-info">
                    <h4>Gerenciar Ícones</h4>
                    <p>
                      Aqui você tem controle de todos os ícones para categorias
                      de sua aplicação
                    </p>
                  </div>
                  <div className="card-image">
                    <FontAwesomeIcon
                      icon={faStickyNote}
                      className="card-icon"
                    />
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

export default privateRoute(['administrator'])(AdminHome);

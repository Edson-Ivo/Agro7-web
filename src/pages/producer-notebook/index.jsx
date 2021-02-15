import React from 'react';
import Head from 'next/head';

import Container from '../../components/Container';
import Navbar from '../../components/Navbar';
import Nav from '../../components/Nav';
import Breadcrumb from '../../components/Breadcrumb';
import Input from '../../components/Input';
import { Section, SectionHeader, SectionBody } from '../../components/Section';
import { Card } from '../../components/Card';

import CardBack from '../../assets/card_back.svg';

export default function ProducerNotebook() {
  return (
    <>
      <Head>
        <title>Caderno do Produtor - Agro7</title>
      </Head>

      <Container>
        <Nav />
        <Section>
          <Navbar />
          <SectionBody>
            <SectionHeader>
              <h2>Caderno do Produtor</h2>
              <Breadcrumb
                path={[
                  { route: '/', name: 'Home' },
                  { route: '/producer-notebook', name: 'Caderno do Produtor' }
                ]}
              />
            </SectionHeader>

            <Input
              type="text"
              label="Pesquisar por nome"
              name="search"
              style={{ marginBottom: '16px' }}
            />

            <Card>
              <div className="card-info">
                <h4>Colheita de Laranjas</h4>
                <p>Observações</p>
              </div>
              <div className="card-image">
                <CardBack />
              </div>
            </Card>
            <Card>
              <div className="card-info">
                <h4>Colheita de Laranjas</h4>
                <p>Observações</p>
              </div>
              <div className="card-image">
                <CardBack />
              </div>
            </Card>
            <Card>
              <div className="card-info">
                <h4>Colheita de Laranjas</h4>
                <p>Observações</p>
              </div>
              <div className="card-image">
                <CardBack />
              </div>
            </Card>
            <Card>
              <div className="card-info">
                <h4>Colheita de Laranjas</h4>
                <p>Observações</p>
              </div>
              <div className="card-image">
                <CardBack />
              </div>
            </Card>
            <Card>
              <div className="card-info">
                <h4>Colheita de Laranjas</h4>
                <p>Observações</p>
              </div>
              <div className="card-image">
                <CardBack />
              </div>
            </Card>
            <Card>
              <div className="card-info">
                <h4>Colheita de Laranjas</h4>
                <p>Observações</p>
              </div>
              <div className="card-image">
                <CardBack />
              </div>
            </Card>
            <Card>
              <div className="card-info">
                <h4>Colheita de Laranjas</h4>
                <p>Observações</p>
              </div>
              <div className="card-image">
                <CardBack />
              </div>
            </Card>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

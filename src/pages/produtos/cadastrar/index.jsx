import React from 'react';
import Head from 'next/head';

import Container from '../../../components/Container';
import Nav from '../../../components/Nav';
import Navbar from '../../../components/Navbar';
import Breadcrumb from '../../../components/Breadcrumb';
import Input from '../../../components/Input';
import {
  Section,
  SectionHeader,
  SectionBody
} from '../../../components/Section';

export default function CadastrarProdutos() {
  return (
    <>
      <Head>
        <title>Cadastrar Produtos - Agro7</title>
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
                  { route: '/produtos', name: 'Produtos' },
                  { route: '/produtos/cadastrar', name: 'Cadastrar Produtos' }
                ]}
              />
              <h2>Cadastrar Produtos</h2>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <div className="form-group">
                <div>
                  <Input type="text" label="Nome do Produto" name="search" />
                </div>
                <div>
                  <Input type="text" label="Variedade" name="search" />
                </div>
              </div>
              <Input
                type="text"
                label="Descrição"
                name="search"
                style={{ height: '200px', whiteSpace: 'pre' }}
              />
              <Input type="file" label="Imagem do produto" name="search" />
              <Input type="file" label="Tabela Nutricional" name="search" />
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

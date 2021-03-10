import React from 'react';
import Head from 'next/head';

import Container from '../../components/Container';
import Nav from '../../components/Nav';
import Navbar from '../../components/Navbar';
import Breadcrumb from '../../components/Breadcrumb';
import { Section, SectionHeader, SectionBody } from '../../components/Section';

import { CardContainer } from '../../components/CardContainer';
import { privateRoute } from '../../components/PrivateRoute';
import NotFound from '../../components/NotFound';
import Table from '../../components/Table';

function AdminHome({ permission }) {
  if (!permission) return <NotFound />;

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
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                <Table>
                  <thead>
                    <tr>
                      <th>Teste</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>aaaaa</td>
                    </tr>
                  </tbody>
                </Table>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute(['administrator'])(AdminHome);
// export default privateRoute()(AdminHome);

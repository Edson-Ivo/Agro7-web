import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Container from '../../../../components/Container';
import Nav from '../../../../components/Nav';
import Navbar from '../../../../components/Navbar';
import Breadcrumb from '../../../../components/Breadcrumb';
import {
  Section,
  SectionHeader,
  SectionBody
} from '../../../../components/Section';

import { CardContainer } from '../../../../components/CardContainer';
import { privateRoute } from '../../../../components/PrivateRoute';
import NotFound from '../../../../components/NotFound';
import Table from '../../../../components/Table';

import Loader from '../../../../components/Loader';
import Error from '../../../../components/Error';
import { useFetch } from '../../../../hooks/useFetch';
import ActionButton from '../../../../components/ActionButton';

function AdminUsers({ permission }) {
  const router = useRouter();
  const id = router.query.id || null;

  const { data, error } = useFetch(`/users/find/by/id/${id}`);

  if (error) return <Error />;
  if (!permission) return <NotFound />;

  return (
    <>
      <Head>
        <title>Painel Adminstrativo | Gerenciar Usuários - Agro7</title>
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
                  { route: '/admin', name: 'Painel Adminstrativo' },
                  { route: '/admin/users', name: 'Gerenciar Usuários' }
                ]}
              />
              <h2>Gerenciar Usuários</h2>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && <div>{data.name}</div>) || <Loader />}
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(AdminUsers);
// export default privateRoute(['adminstrator'])(AdminUsers);

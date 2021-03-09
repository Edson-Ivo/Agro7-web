import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Container from '../../../../components/Container';
import Nav from '../../../../components/Nav';
import Navbar from '../../../../components/Navbar';
import Breadcrumb from '../../../../components/Breadcrumb';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import {
  Section,
  SectionHeader,
  SectionBody
} from '../../../../components/Section';

import { CardContainer } from '../../../../components/CardContainer';
import { privateRoute } from '../../../../components/PrivateRoute';
import NotFound from '../../../../components/NotFound';

import Loader from '../../../../components/Loader';
import Error from '../../../../components/Error';
import { useFetch } from '../../../../hooks/useFetch';

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
                {(data && (
                  <>
                    <Input
                      type="text"
                      label="Nome"
                      name="name"
                      initialValue={data.name}
                      disabled
                    />
                    <div className="form-group">
                      <div>
                        <Input
                          type="text"
                          label="Número Telefone"
                          name="phone"
                          mask="phone"
                          maxLength={15}
                          initialValue={data.phone}
                          disabled
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          label="Número Whatsapp"
                          name="phone_whatsapp"
                          mask="phone"
                          maxLength={15}
                          initialValue={data.phone_whatsapp}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="form-group buttons">
                      <div>
                        <Link href={`/admin/users/edit/${id}`}>
                          <Button>Editar Dados</Button>
                        </Link>
                      </div>
                      <div>
                        <Button className="red">Excluir</Button>
                      </div>
                    </div>
                  </>
                )) || <Loader />}
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute(['administrator'])(AdminUsers);
// export default privateRoute()(AdminUsers);

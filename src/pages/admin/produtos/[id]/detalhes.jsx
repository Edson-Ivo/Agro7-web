import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';

import TextArea from '@/components/TextArea/index';
import NotFound from '@/components/NotFound';

import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader/index';

function AdminProductsDetails({ permission }) {
  const router = useRouter();

  const { id } = router.query;
  const { data, error } = useFetch(`/products/find/by/id/${id}`);

  if (!permission) return <NotFound />;

  return (
    <>
      {error && router.back()}
      <Head>
        <title>
          Painel Adminstrativo | Produto {data && data.name} - Agro7
        </title>
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
                  { route: '/admin/produtos', name: 'Gerenciar Produtos' }
                ]}
              />
              <h2>Informações do Produto {data && `(${data.name})`}</h2>
              <p>Aqui você irá ver informações do produto em questão</p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && (
                  <>
                    <Input
                      type="text"
                      name="name"
                      label="Nome do produto"
                      initialValue={data.name}
                      disabled
                    />
                    <TextArea
                      name="description"
                      label="Descrição do produto"
                      initialValue={data.description}
                      disabled
                    />
                    <Input
                      type="text"
                      name="image"
                      label="Imagem atual"
                      initialValue={data.url}
                      disabled
                    />
                    <div className="form-group buttons">
                      <div>
                        <Button onClick={() => router.back()}>Voltar</Button>
                      </div>
                      <div>
                        <Button
                          className="primary"
                          onClick={() =>
                            router.push(`/admin/produtos/${id}/editar`)
                          }
                        >
                          Editar
                        </Button>
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

export default privateRoute(['administrator'])(AdminProductsDetails);

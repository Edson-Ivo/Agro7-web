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
import Error from '@/components/Error';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader/index';
import { ColorViewer } from '@/components/ColorsContainer/index';
import { isLight } from '@/helpers/colors';
import TextArea from '@/components/TextArea/index';

function AdminCategoriesDetails() {
  const router = useRouter();

  const { id } = router.query;
  const { data: dataCategory, error } = useFetch(
    `/categories/find/by/id/${id}`
  );

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>
          Painel Adminstrativo | Categoria {dataCategory && dataCategory.name} -
          Agro7
        </title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              {dataCategory && (
                <Breadcrumb
                  path={[
                    { route: '/', name: 'Home' },
                    { route: '/admin', name: 'Painel Adminstrativo' },
                    { route: '/admin/categorias', name: 'Categorias' },
                    {
                      route: `/admin/categorias/${id}/detalhes`,
                      name: `Categoria ${dataCategory?.name}`
                    }
                  ]}
                />
              )}
              <h2>
                Informações da Categoria{' '}
                {dataCategory && `(${dataCategory.name})`}
              </h2>
              <p>Aqui você irá ver informações da categoria em questão</p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(dataCategory && (
                  <>
                    <Input
                      type="text"
                      label="Nome"
                      name="name"
                      initialValue={dataCategory.name}
                      disabled
                    />

                    <TextArea
                      name="description"
                      label="Descrição"
                      initialValue={dataCategory.description}
                      disabled
                    />

                    <ColorViewer
                      fillColor={dataCategory.colors.hexadecimal}
                      isLight={isLight(dataCategory.colors.hexadecimal)}
                    >
                      {`${dataCategory.colors.name}`}
                    </ColorViewer>
                    <div className="form-group buttons">
                      <div>
                        <Button type="button" onClick={() => router.back()}>
                          Voltar
                        </Button>
                      </div>
                      <div>
                        <Button
                          className="primary"
                          type="button"
                          onClick={() =>
                            router.push(`/admin/categorias/${id}/editar`)
                          }
                        >
                          Editar Categoria
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

export default privateRoute(['administrator'])(AdminCategoriesDetails);

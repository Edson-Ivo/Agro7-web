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

function AdminCoresDetails() {
  const router = useRouter();

  const { id } = router.query;
  const { data: dataColor, error } = useFetch(`/colors/find/by/id/${id}`);

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>
          Painel Administrativo | Cor {dataColor && dataColor.name} - Agro7
        </title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              {dataColor && (
                <Breadcrumb
                  path={[
                    { route: '/', name: 'Home' },
                    { route: '/admin', name: 'Painel Administrativo' },
                    { route: '/admin/cores', name: 'Cores para Categorias' },
                    {
                      route: `/admin/cores/${id}/detalhes`,
                      name: `Cor ${dataColor?.name}`
                    }
                  ]}
                />
              )}
              <h2>Informações da Cor {dataColor && `(${dataColor.name})`}</h2>
              <p>Aqui você irá ver informações da cor em questão</p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(dataColor && (
                  <>
                    <Input
                      type="text"
                      label="Nome"
                      name="name"
                      initialValue={dataColor.name}
                      disabled
                    />

                    <ColorViewer
                      fillColor={dataColor.hexadecimal}
                      isLight={isLight(dataColor.hexadecimal)}
                    >
                      {`#${dataColor.hexadecimal}`}
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
                            router.push(`/admin/cores/${id}/editar`)
                          }
                        >
                          Editar Cor
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

export default privateRoute(['administrador'])(AdminCoresDetails);

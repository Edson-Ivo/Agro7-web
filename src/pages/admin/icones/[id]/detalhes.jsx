import React from 'react';
import Head from 'next/head';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import Error from '@/components/Error';

import { privateRoute } from '@/components/PrivateRoute';

import { useRouter } from 'next/router';
import TextArea from '@/components/TextArea/index';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader/index';

function AdminIconsDetails({ permission }) {
  const router = useRouter();

  const { id } = router.query;
  const { data: dataIcon, error } = useFetch(`/icons/find/by/id/${id}`);

  const handleCancel = () => {
    router.back();
  };

  if (!permission) return <Error error={404} />;

  return (
    <>
      {error && router.back()}
      <Head>
        <title>
          Painel Adminstrativo | Ícone {dataIcon && dataIcon.name} - Agro7
        </title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              {dataIcon && (
                <Breadcrumb
                  path={[
                    { route: '/', name: 'Home' },
                    { route: '/admin', name: 'Painel Adminstrativo' },
                    { route: '/admin/icones', name: 'Ícones para Categorias' },
                    {
                      route: `/admin/icons/${id}/detalhes`,
                      name: `Ícone ${dataIcon.name}`
                    }
                  ]}
                />
              )}
              <h2>Informações do Ícone {dataIcon && `(${dataIcon.name})`}</h2>
              <p>Aqui você irá ver informações do ícone em questão</p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(dataIcon && (
                  <>
                    <Input
                      type="text"
                      name="name"
                      label="Nome do ícone"
                      initialValue={dataIcon.name}
                      disabled
                    />
                    <TextArea
                      name="description"
                      label="Descrição do ícone"
                      initialValue={dataIcon.description}
                      disabled
                    />
                    <Input
                      type="text"
                      name="image"
                      label="Imagem atual"
                      initialValue={dataIcon.url}
                      disabled
                    />

                    <div className="form-group buttons">
                      <div>
                        <Button type="button" onClick={handleCancel}>
                          Cancelar
                        </Button>
                      </div>

                      <div>
                        <Button
                          className="primary"
                          type="button"
                          onClick={() =>
                            router.push(`/admin/icones/${id}/editar`)
                          }
                        >
                          Editar Ícone
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

export default privateRoute(['administrator'])(AdminIconsDetails);

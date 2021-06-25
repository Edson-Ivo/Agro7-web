import React, { useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
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
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import isEmpty from '@/helpers/isEmpty';

function AdminCategoriesDetails() {
  const router = useRouter();
  const formRef = useRef(null);

  const { id } = router.query;
  const { data: dataCategory, error } = useFetch(
    `/categories/find/by/id/${id}`
  );

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>
          Painel Administrativo | Categoria {dataCategory && dataCategory.name}{' '}
          - Agro7
        </title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%categoria': dataCategory?.name
              }}
              title={`Informações da Categoria ${dataCategory?.name}`}
              description="Aqui você irá ver informações da categoria em questão"
              isLoading={isEmpty(dataCategory)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(dataCategory && (
                  <>
                    <Form
                      ref={formRef}
                      initialData={{
                        ...dataCategory
                      }}
                    >
                      <Input type="text" label="Nome" name="name" disabled />
                      <TextArea name="description" label="Descrição" disabled />

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
                    </Form>
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

export default privateRoute(['administrador'])(AdminCategoriesDetails);

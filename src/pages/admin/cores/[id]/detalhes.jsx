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
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import isEmpty from '@/helpers/isEmpty';
import usersTypes from '@/helpers/usersTypes';

function AdminCoresDetails() {
  const router = useRouter();
  const formRef = useRef(null);

  const { id } = router.query;
  const { data: dataColor, error } = useFetch(`/colors/find/by/id/${id}`);

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>
          Painel Administrativo | Cor {dataColor && dataColor.name} - Agro9
        </title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%cor': dataColor?.name
              }}
              title={`Informações da Cor ${dataColor?.name}`}
              description="Aqui, você irá ver informações da cor em questão"
              isLoading={isEmpty(dataColor)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(dataColor && (
                  <>
                    <Form
                      ref={formRef}
                      initialData={{
                        ...dataColor
                      }}
                    >
                      <Input type="text" label="Nome" name="name" disabled />

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

export default privateRoute([usersTypes[0]])(AdminCoresDetails);

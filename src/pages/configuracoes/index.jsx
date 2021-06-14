import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import Error from '@/components/Error';
import { CardContainer } from '@/components/CardContainer';

import { privateRoute } from '@/components/PrivateRoute';
import Loader from '@/components/Loader';

import { useFetch } from '@/hooks/useFetch';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

function Configuracoes() {
  const { data, error } = useFetch(`/users/find/by/logged`);
  const formRef = useRef(null);

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>Meus Dados - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumb={[
                { route: '/', name: 'Home' },
                { route: '/configuracoes', name: 'Configurações' }
              ]}
              title="Meus Dados"
              description="Esses são os dados de sua conta, aqui você pode os editar ou
                alterar sua senha."
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && (
                  <>
                    <Form
                      ref={formRef}
                      initialData={{
                        ...data
                      }}
                    >
                      <Input type="text" label="Nome" name="name" disabled />
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="Número Telefone"
                            name="phone"
                            mask="phone"
                            maxLength={15}
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
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="CEP"
                            name="addresses.postcode"
                            mask="cep"
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Estado"
                            name="addresses.state"
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Cidade"
                            name="addresses.city"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="Bairro"
                            name="addresses.neighborhood"
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Rua"
                            name="addresses.street"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="Número"
                            name="addresses.number"
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Complementos"
                            name="addresses.complement"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group buttons">
                        <div>
                          <Link href="configuracoes/editar">
                            <Button type="button">Editar Dados</Button>
                          </Link>
                        </div>
                        <div>
                          <Link href="configuracoes/senha">
                            <Button type="button">Alterar Senha</Button>
                          </Link>
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

export default privateRoute()(Configuracoes);

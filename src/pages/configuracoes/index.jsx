import React from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';

import Link from 'next/link';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import Error from '@/components/Error';
import { CardContainer } from '@/components/CardContainer';

import { privateRoute } from '@/components/PrivateRoute';
import Loader from '@/components/Loader';

import { useFetch } from '@/hooks/useFetch';

function Configuracoes() {
  const { id } = useSelector(state => state.user);

  const { data, error } = useFetch(`/users/find/by/id/${id}`);

  if (error) return <Error />;

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
            <div className="SectionHeader__content">
              <Breadcrumb
                path={[
                  { route: '/', name: 'Home' },
                  { route: '/configuracoes', name: 'Configurações' }
                ]}
              />
              <h2>Meus Dados</h2>
              <p>
                Esses são os dados de sua conta, aqui você pode os editar ou
                alterar sua senha.
              </p>
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
                          initialValue={data?.phone_whatsapp || ''}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div>
                        <Input
                          type="text"
                          label="CEP"
                          name="postcode"
                          initialValue={data.addresses.postcode}
                          mask="cep"
                          disabled
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          label="Estado"
                          name="state"
                          initialValue={data.addresses.state}
                          disabled
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          label="Cidade"
                          name="city"
                          initialValue={data.addresses.city}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div>
                        <Input
                          type="text"
                          label="Bairro"
                          name="neighborhood"
                          initialValue={data.addresses.neighborhood}
                          disabled
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          label="Rua"
                          name="street"
                          initialValue={data.addresses.street}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div>
                        <Input
                          type="text"
                          label="Número"
                          name="number"
                          initialValue={data.addresses.number}
                          disabled
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          label="Complementos"
                          name="complements"
                          initialValue={data.addresses.complements || ''}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="form-group buttons">
                      <div>
                        <Link href="configuracoes/editar">
                          <Button>Editar Dados</Button>
                        </Link>
                      </div>
                      <div>
                        <Link href="configuracoes/senha">
                          <Button>Alterar Senha</Button>
                        </Link>
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

export default privateRoute(['administrator'])(Configuracoes);

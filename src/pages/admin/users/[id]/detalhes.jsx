import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import Error from '@/components/Error';

import Loader from '@/components/Loader';
import { useFetch } from '@/hooks/useFetch';
import capitalize from '@/helpers/capitalize';

function AdminUsers() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useFetch(`/users/find/by/id/${id}`);
  const { data: dataTypes } = useFetch('/users/find/all/types');

  if (error) return <Error error={error} />;

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
              {data && (
                <Breadcrumb
                  path={[
                    { route: '/', name: 'Home' },
                    { route: '/admin', name: 'Painel Adminstrativo' },
                    { route: '/admin/users', name: 'Usuários' },
                    {
                      route: `/admin/users/${id}/detalhes`,
                      name: `${data?.name}`
                    }
                  ]}
                />
              )}
              <h2>Informações do Usuário {data && `(${data.name})`}</h2>
              <p>
                Aqui você irá ver informações detalhadas do usuário em questão
              </p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && dataTypes && (
                  <>
                    <Input
                      type="text"
                      label="Nome"
                      name="name"
                      initialValue={data.name}
                      disabled
                    />
                    <Input
                      type="text"
                      label="E-mail"
                      name="email"
                      initialValue={data.email}
                      disabled
                    />
                    <Input
                      type="text"
                      label="Documento"
                      name="documents"
                      initialValue={data.documents}
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
                          initialValue={data.phone_whatsapp || ''}
                          disabled
                        />
                      </div>
                    </div>
                    <Select
                      options={dataTypes?.typesUser.map(userType => ({
                        value: userType,
                        label: capitalize(userType)
                      }))}
                      label="Tipo de Usuário"
                      value={data.types}
                      name="types"
                      disabled
                    />
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
                  </>
                )) || <Loader />}
                <div className="form-group buttons">
                  <div>
                    <Button onClick={() => router.back()}>Voltar</Button>
                  </div>
                  <div>
                    <Button
                      className="primary"
                      onClick={() => router.push(`/admin/users/${id}/editar`)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute(['administrator'])(AdminUsers);

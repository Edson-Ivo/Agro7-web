import React, { useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

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
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import isEmpty from '@/helpers/isEmpty';
import maskString from '@/helpers/maskString';
import usersTypes from '@/helpers/usersTypes';

function AdminUsersNotActiveDetails() {
  const router = useRouter();
  const { id } = router.query;

  const formRef = useRef(null);

  const { data, error } = useFetch(
    `/users/find/without-verified-email/by/id/${id}`
  );
  const { data: dataTypes } = useFetch('/users/find/all/types');

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>
          Painel Administrativo | Gerenciar Usuário não Ativado - Agro7
        </title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%usuario': data?.name
              }}
              title={`Informações do Usuário ${data?.name}`}
              description="Aqui, você irá ver informações detalhadas do usuário não ativado em questão"
              isLoading={isEmpty(data)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && dataTypes && (
                  <>
                    <Form
                      ref={formRef}
                      initialData={{
                        ...data,
                        phone: maskString(data?.phone, 'phone') || '',
                        phone_whatsapp:
                          maskString(data?.phone_whatsapp, 'phone') || '',
                        document: maskString(data?.document, 'document') || '',
                        addresses_postcode:
                          maskString(data?.addresses?.postcode, 'postcode') ||
                          ''
                      }}
                    >
                      <Input type="text" label="Nome" name="name" disabled />
                      <Input type="text" label="E-mail" name="email" disabled />
                      <Input
                        type="text"
                        label="Documento"
                        name="document"
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
                      <Select
                        options={dataTypes?.typesUser.map(userType => ({
                          value: userType,
                          label: capitalize(userType)
                        }))}
                        label="Tipo de Usuário"
                        name="type"
                        disabled
                      />
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="CEP"
                            name="addresses_postcode"
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
                            label="Complemento"
                            name="addresses.complement"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group buttons">
                        <div>
                          <Button type="button" onClick={() => router.back()}>
                            Voltar
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

export default privateRoute([usersTypes[0]])(AdminUsersNotActiveDetails);

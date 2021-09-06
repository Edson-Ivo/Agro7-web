import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';

import { Alert } from '@/components/Alert';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import Error from '@/components/Error';
import Loader from '@/components/Loader';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { useFetch } from '@/hooks/useFetch';

import AddressesService from '@/services/AddressesService';
import UsersService from '@/services/UsersService';
import errorMessage from '@/helpers/errorMessage';
import extractNumbers from '@/helpers/extractNumbers';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import maskString from '@/helpers/maskString';

const schema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório!'),
  phone: yup.string().required('O campo telefone é obrigatório!'),
  phone_whatsapp: yup.string().nullable(),
  addresses: yup.object().shape({
    state: yup
      .string()
      .min(2, 'O estado tem que ter no mínimo 2 caracteres')
      .max(15, 'Você não pode ultrapassar 15 caracteres no nome do estado')
      .required('Você precisa informar o estado da do endereço do usuário.'),
    neighborhood: yup
      .string()
      .min(2, 'O nome do bairro tem que ter no mínimo 2 caracteres')
      .max(50, 'Você não pode ultrapassar 50 caracteres no nome do bairro')
      .required('Você precisa informar o bairro da do endereço do usuário'),
    city: yup
      .string()
      .min(2, 'O nome da cidade tem que ter no mínimo 2 caracteres')
      .max(50, 'O nome da cidade não pode ultrapassar 50 caracteres')
      .required('Você precisa informar a cidade do endereço do usuário'),
    postcode: yup
      .string()
      .min(
        9,
        'Você tem que digitar no mínimo e no máximo 9 caracteres, para o CEP. Ex: 00000-000'
      )
      .max(
        9,
        'Você tem que digitar no mínimo e no máximo 9 caracteres para o CEP. Ex: 00000-000'
      )
      .required('Você precisa informar o CEP do endereço do usuário'),
    street: yup
      .string()
      .max(50, 'O nome da rua não pode ultrapassar 50 caracteres')
      .required('Você precisa informar a rua do endereço do usuário'),
    number: yup
      .string()
      .max(50, 'O número não pode ultrapassar 50 caracteres')
      .required('Você precisa informar o número do endereço do usuário'),
    complement: yup
      .string()
      .max(100, 'O complemento não pode ultrapassar 100 caracteres')
      .nullable()
  })
});

function ConfiguracoesEdit() {
  const router = useRouter();

  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const formRef = useRef(null);

  const { data, error, mutate } = useFetch(`/users/find/by/logged`);

  const handleChangeCep = e => {
    const { value } = e.target;
    if (value.length === 9) {
      setLoadingAddresses(true);
      AddressesService.getCep(value.replace('-', '')).then(res => {
        if (res.data !== '') {
          const { state, city, neighborhood, street } = res.data;

          formRef.current.setFieldValue('state', state);
          formRef.current.setFieldValue('city', city);
          formRef.current.setFieldValue('neighborhood', neighborhood);
          formRef.current.setFieldValue('street', street);
        }
        setLoadingAddresses(false);
      });
    }
  };

  const handleSubmit = async d => {
    setDisableButton(true);

    schema
      .validate(d)
      .then(async dataReq => {
        setLoading(true);

        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        dataReq.phone = extractNumbers(dataReq.phone);
        dataReq.phone_whatsapp = extractNumbers(dataReq.phone_whatsapp);

        if (!dataReq.phone_whatsapp) delete dataReq.phone_whatsapp;

        await UsersService.updateByOwner(dataReq).then(async res => {
          if (res.status >= 400 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
          } else {
            mutate();

            setAlert({
              type: 'success',
              message: 'Dados alterados com sucesso!'
            });

            setTimeout(() => {
              router.push(`/configuracoes/`);
              setDisableButton(false);
            }, 1000);
          }

          setLoading(false);
        });
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
      });

    setTimeout(() => {
      setDisableButton(false);
    }, 1000);
  };

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>Editar meus dados - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title="Editar Dados"
              description="Edite abaixo os dados de sua conta."
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                {(data && (
                  <Form
                    ref={formRef}
                    method="post"
                    onSubmit={handleSubmit}
                    initialData={{
                      ...data,
                      phone: maskString(data?.phone, 'phone') || '',
                      phone_whatsapp:
                        maskString(data?.phone_whatsapp, 'phone') || '',
                      addresses: {
                        ...data?.addresses,
                        postcode:
                          maskString(data?.addresses?.postcode, 'postcode') ||
                          ''
                      }
                    }}
                  >
                    <Input type="text" label="Nome" name="name" required />
                    <div className="form-group">
                      <div>
                        <Input
                          type="text"
                          label="Número Telefone"
                          name="phone"
                          mask="phone"
                          maxLength={15}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          label="Número Whatsapp"
                          name="phone_whatsapp"
                          mask="phone"
                          maxLength={15}
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
                          disabled={loadingAddresses}
                          handleChange={handleChangeCep}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          label="Estado"
                          name="addresses.state"
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          label="Cidade"
                          name="addresses.city"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div>
                        <Input
                          type="text"
                          label="Bairro"
                          name="addresses.neighborhood"
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          label="Rua"
                          name="addresses.street"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div>
                        <Input
                          type="text"
                          label="Número"
                          name="addresses.number"
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          label="Complemento"
                          name="addresses.complement"
                        />
                      </div>
                    </div>

                    {(!loading && (
                      <div className="form-group buttons">
                        <div>
                          <Link href="/configuracoes">
                            <Button type="button">Cancelar</Button>
                          </Link>
                        </div>
                        <div>
                          <Button
                            disabled={disableButton}
                            className="primary"
                            type="submit"
                          >
                            Salvar
                          </Button>
                        </div>
                      </div>
                    )) || <Loader />}
                  </Form>
                )) || <Loader />}
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(ConfiguracoesEdit);

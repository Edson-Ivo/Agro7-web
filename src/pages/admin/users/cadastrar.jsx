import React, { useState, useRef } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import { useRouter } from 'next/router';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import NotFound from '@/components/NotFound';
import getFormData from '@/helpers/getFormData';
import AddressesService from '@/services/AddressesService';
import UsersServices from '@/services/UsersServices';
import errorMessage from '@/helpers/errorMessage';
import extractNumbers from '@/helpers/extractNumbers';

const schema = yup.object().shape({
  name: yup
    .string()
    .min(4, 'O nome precisa ter no mínimo 4 caracteres')
    .required('O campo nome é obrigatório!'),
  email: yup
    .string()
    .email('O e-mail precisa ser um e-mail válido')
    .required('O campo e-mail é obrigatório!'),
  password: yup.string().required('O campo senha é obrigatório!'),
  documents: yup.string().min(11).required('O campo documento é obrigatório!'),
  phone: yup.string().required('O campo telefone é obrigatório!'),
  phone_whatsapp: yup.string(),
  types: yup.string().required('O campo tipo de usuário é obrigatório!'),
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
    .min(4, 'O nome da rua tem que ter no mínimo 4 caracteres')
    .max(50, 'O nome da rua não pode ultrapassar 50 caracteres')
    .required('Você precisa informar a rua do endereço do usuário'),
  number: yup
    .string()
    .max(50, 'O número não pode ultrapassar 50 caracteres')
    .required('Você precisa informar o número do endereço do usuário'),
  complements: yup
    .string()
    .max(100, 'O complemento não pode ultrapassar 100 caracteres')
    .nullable()
});

function AdminUsers({ permission }) {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const router = useRouter();
  const formRef = useRef(null);

  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const neighborhoodRef = useRef(null);
  const streetRef = useRef(null);
  const postalcodeRef = useRef(null);

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        name: null,
        email: null,
        password: null,
        documents: null,
        type_documents: null,
        phone: null,
        phone_whatsapp: null,
        types: null,
        state: null,
        neighborhood: null,
        city: null,
        postcode: null,
        street: null,
        number: null,
        complements: null
      };
    }

    return getFormData(formRef.current, {
      name: null,
      email: null,
      password: null,
      documents: null,
      type_documents: false,
      phone: null,
      phone_whatsapp: null,
      types: null,
      state: null,
      neighborhood: null,
      city: null,
      postcode: null,
      street: null,
      number: null,
      complements: null
    });
  };

  const handleChangeCep = e => {
    const { value } = e.target;
    if (value.length === 9) {
      setLoadingAddresses(true);
      AddressesService.getCep(value.replace('-', '')).then(res => {
        if (res.data !== '') {
          const { state, city, neighborhood, street } = res.data;
          if (!stateRef.current.value) {
            stateRef.current.setValue(state);
          }
          if (!cityRef.current.value) {
            cityRef.current.setValue(city);
          }
          if (!neighborhoodRef.current.value) {
            neighborhoodRef.current.setValue(neighborhood);
          }
          if (!streetRef.current.value) {
            streetRef.current.setValue(street);
          }
        }
        setLoadingAddresses(false);
      });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setDisableButton(true);
    schema
      .validate(getData())
      .then(async data => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        if (data.documents.length <= 14) data.type_documents = false;
        else data.type_documents = true;

        data.phone = extractNumbers(data.phone);
        data.phone_whatsapp = extractNumbers(data.phone_whatsapp);

        if (!data.phone_whatsapp) delete data.phone_whatsapp;

        await UsersServices.create(data).then(res => {
          if (res.status !== 201 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            setAlert({
              type: 'success',
              message: 'Usuário cadastrado com sucesso!'
            });

            setTimeout(() => {
              router.push('/admin/users');
              setDisableButton(false);
            }, 1000);
          }
        });
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
        setDisableButton(false);
      });
  };

  if (!permission) return <NotFound />;

  return (
    <>
      <Head>
        <title>Painel Adminstrativo | Cadastrar Usuário - Agro7</title>
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
                  { route: '/admin', name: 'Painel Adminstrativo' },
                  { route: '/admin/users', name: 'Gerenciar Usuários' },
                  {
                    route: '/admin/users/cadastrar',
                    name: 'Cadastrar Usuários'
                  }
                ]}
              />
              <h2>Cadastre um usuário</h2>
              <p>Aqui você irá cadastrar um usuário para o sistema</p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                <form
                  id="registerForm"
                  ref={formRef}
                  method="post"
                  onSubmit={event => handleSubmit(event)}
                >
                  <Input type="text" label="Nome" name="name" required />
                  <Input type="text" label="E-mail" name="email" required />
                  <Input
                    type="password"
                    label="Senha"
                    name="password"
                    required
                  />
                  <Input
                    type="text"
                    label="Documento (CPF ou CNPJ)"
                    name="documents"
                    mask="cpf_cnpj"
                    maxLength="18"
                    required
                  />
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
                  <Select
                    options={[
                      { value: 'administrator', label: 'Administrador' }
                    ]}
                    label="Tipo de Usuário"
                    name="types"
                    required
                  />
                  <div className="form-group">
                    <div>
                      <Input
                        type="text"
                        label="CEP"
                        name="postcode"
                        initialValue=""
                        mask="cep"
                        disabled={loadingAddresses}
                        ref={postalcodeRef}
                        handleChange={handleChangeCep}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        label="Estado"
                        name="state"
                        initialValue=""
                        ref={stateRef}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        label="Cidade"
                        name="city"
                        initialValue=""
                        ref={cityRef}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div>
                      <Input
                        type="text"
                        label="Bairro"
                        name="neighborhood"
                        initialValue=""
                        ref={neighborhoodRef}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        label="Rua"
                        name="street"
                        initialValue=""
                        ref={streetRef}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div>
                      <Input
                        type="text"
                        label="Número"
                        name="number"
                        initialValue=""
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        label="Complementos"
                        name="complements"
                        initialValue=""
                      />
                    </div>
                  </div>

                  <div className="form-group buttons">
                    <div>
                      <Button type="button" onClick={() => router.back()}>
                        Voltar
                      </Button>
                    </div>
                    <div>
                      <Button
                        disabled={disableButton}
                        className="primary"
                        type="submit"
                      >
                        Cadastrar Usuário
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute(['administrator'])(AdminUsers);

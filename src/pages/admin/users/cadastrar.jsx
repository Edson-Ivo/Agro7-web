import React, { useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import AddressesService from '@/services/AddressesService';
import UsersService from '@/services/UsersService';
import errorMessage from '@/helpers/errorMessage';
import extractNumbers from '@/helpers/extractNumbers';
import { useFetch } from '@/hooks/useFetch';
import capitalize from '@/helpers/capitalize';
import Loader from '@/components/Loader/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import { useModal } from '@/hooks/useModal';
import scrollTo from '@/helpers/scrollTo';

const schema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório!'),
  email: yup
    .string()
    .email('O e-mail precisa ser um e-mail válido')
    .required('O campo e-mail é obrigatório!'),
  password: yup.string().required('O campo senha é obrigatório!'),
  document: yup.string().min(11).required('O campo documento é obrigatório!'),
  phone: yup.string().required('O campo telefone é obrigatório!'),
  phone_whatsapp: yup.string().nullable(),
  type: yup.string().required('O campo tipo de usuário é obrigatório!'),
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
});

function AdminUsers() {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const router = useRouter();
  const formRef = useRef(null);
  const alertRef = useRef(null);

  const { addModal, removeModal } = useModal();

  const { data: dataTypes } = useFetch('/users/find/all/types');

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
      .then(async data => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        scrollTo(alertRef);

        if (data.document.length <= 14) data.type_document = false;
        else data.type_document = true;

        data.phone = extractNumbers(data.phone);
        data.phone_whatsapp = extractNumbers(data.phone_whatsapp);

        if (isEmpty(data.phone_whatsapp)) delete data.phone_whatsapp;

        if (data?.type === 'administrador') handleConfirmAdminCreate(data);
        else handleCreateUser(data);
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
        setDisableButton(false);

        if (err instanceof yup.ValidationError) {
          const { path, message } = err;

          formRef.current.setFieldError(path, message);
        }
      });
  };

  const handleCreateUser = async data => {
    await UsersService.create(data).then(res => {
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
          router.push('/admin/users/nao-ativado');
          setDisableButton(false);
        }, 1000);
      }
    });
  };

  const handleConfirmAdminCreate = useCallback(
    data => {
      addModal({
        title: 'Cadastro de Administrador',
        text:
          'Deseja realmente cadastrar um novo administrador ao sistema? Lembre-se de que você não poderá deletá-lo ou desativá-lo após sua criação.',
        confirm: true,
        onConfirm: () => handleCreateUser(data),
        onCancel: () => handleCancelModal(removeModal)
      });
    },
    [addModal, removeModal]
  );

  const handleCancelModal = removeModalAction => {
    setDisableButton(false);
    setAlert({ type: 'info', message: 'Cadastro de usuário cancelado.' });
    removeModalAction();
  };

  return (
    <>
      <Head>
        <title>Painel Administrativo | Cadastrar Usuário - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title="Cadastre um usuário"
              description="Aqui, você irá cadastrar um usuário para o sistema"
              isLoading={false}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type} ref={alertRef}>
                    {alert.message}
                  </Alert>
                )}
                {(dataTypes && (
                  <>
                    <Form ref={formRef} method="post" onSubmit={handleSubmit}>
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
                        name="document"
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
                        options={dataTypes?.typesUser.map(userType => ({
                          value: userType,
                          label: capitalize(userType)
                        }))}
                        label="Tipo de Usuário"
                        name="type"
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
                            required
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Cidade"
                            name="city"
                            initialValue=""
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
                            required
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Rua"
                            name="street"
                            initialValue=""
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
                            label="Complemento"
                            name="complement"
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

export default privateRoute(['administrador'])(AdminUsers);

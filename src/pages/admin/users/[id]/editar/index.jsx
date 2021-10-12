import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as yup from 'yup';
import { Form } from '@unform/web';

import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { Alert } from '@/components/Alert';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import AddressesService from '@/services/AddressesService';
import UsersService from '@/services/UsersService';
import errorMessage from '@/helpers/errorMessage';
import extractNumbers from '@/helpers/extractNumbers';
import { useFetch } from '@/hooks/useFetch';
import capitalize from '@/helpers/capitalize';
import Loader from '@/components/Loader/index';
import Error from '@/components/Error/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import maskString from '@/helpers/maskString';
import scrollTo from '@/helpers/scrollTo';

const schema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório!'),
  email: yup
    .string()
    .email('O e-mail precisa ser um e-mail válido')
    .required('O campo e-mail é obrigatório!'),
  document: yup.string().min(11).required('O campo documento é obrigatório!'),
  phone: yup.string().required('O campo telefone é obrigatório!'),
  phone_whatsapp: yup.string().nullable(),
  type: yup.string().required('O campo tipo de usuário é obrigatório!'),
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

function AdminUsersEdit() {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const router = useRouter();
  const formRef = useRef(null);
  const alertRef = useRef(null);

  const { id } = router.query;

  const { data, error, mutate } = useFetch(`/users/find/by/id/${id}`);
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

  const handleSubmit = async dt => {
    setDisableButton(true);

    schema
      .validate(dt)
      .then(async d => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        scrollTo(alertRef);

        if (d.document.length <= 14) d.type_document = false;
        else d.type_document = true;

        d.phone = extractNumbers(d.phone);
        d.phone_whatsapp = extractNumbers(d.phone_whatsapp);

        if (isEmpty(d.phone_whatsapp)) delete d.phone_whatsapp;

        await UsersService.updateByAdmin(id, d).then(res => {
          if (res.status !== 201 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            mutate();

            setAlert({
              type: 'success',
              message: 'Usuário editado com sucesso!'
            });

            setTimeout(() => {
              router.push(`/admin/users/${id}/detalhes`);
              setDisableButton(false);
            }, 1000);
          }
        });
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

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>Painel Administrativo | Editar Usuário - Agro7</title>
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
              title={`Editar Usuário ${data?.name}`}
              description="Aqui, você irá editar o usuário em questão"
              isLoading={isEmpty(data)}
            >
              <Link href={`/admin/users/${id}/editar/senha`}>
                <Button className="primary">
                  <FontAwesomeIcon icon={faKey} /> Alterar Senha
                </Button>
              </Link>
            </SectionHeaderContent>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type} ref={alertRef}>
                    {alert.message}
                  </Alert>
                )}
                {(data && dataTypes && (
                  <>
                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmit}
                      initialData={{
                        ...data,
                        phone: maskString(data?.phone, 'phone') || '',
                        phone_whatsapp:
                          maskString(data?.phone_whatsapp, 'phone') || '',
                        document: maskString(data?.document, 'document') || '',
                        addresses: {
                          ...data?.addresses,
                          postcode:
                            maskString(data?.addresses?.postcode, 'postcode') ||
                            ''
                        }
                      }}
                    >
                      <Input type="text" label="Nome" name="name" required />
                      <Input type="text" label="E-mail" name="email" required />
                      <Input
                        type="text"
                        label="Documento"
                        name="document"
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
                            Salvar
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

export default privateRoute(['administrador'])(AdminUsersEdit);

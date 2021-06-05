import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { Alert } from '@/components/Alert';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import getFormData from '@/helpers/getFormData';
import AddressesService from '@/services/AddressesService';
import UsersService from '@/services/UsersService';
import errorMessage from '@/helpers/errorMessage';
import extractNumbers from '@/helpers/extractNumbers';
import { useFetch } from '@/hooks/useFetch';
import capitalize from '@/helpers/capitalize';
import Loader from '@/components/Loader/index';
import Error from '@/components/Error/index';
import isEmpty from '@/helpers/isEmpty';

const schema = yup.object().shape({
  name: yup
    .string()
    .min(4, 'O nome precisa ter no mínimo 4 caracteres')
    .required('O campo nome é obrigatório!'),
  email: yup
    .string()
    .email('O e-mail precisa ser um e-mail válido')
    .required('O campo e-mail é obrigatório!'),
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
    .min(4, 'O nome da rua tem que ter no mínimo 4 caracteres')
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

function AdminUsersEdit() {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const router = useRouter();
  const formRef = useRef(null);

  const { id } = router.query;

  const { data, error } = useFetch(`/users/find/by/id/${id}`);
  const { data: dataTypes } = useFetch('/users/find/all/types');

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
        document: null,
        type_document: null,
        phone: null,
        phone_whatsapp: null,
        type: null,
        state: null,
        neighborhood: null,
        city: null,
        postcode: null,
        street: null,
        number: null,
        complement: null
      };
    }

    return getFormData(formRef.current, {
      name: null,
      email: null,
      document: null,
      type_document: false,
      phone: null,
      phone_whatsapp: null,
      type: null,
      state: null,
      neighborhood: null,
      city: null,
      postcode: null,
      street: null,
      number: null,
      complement: null
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
      .then(async d => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        if (d.document.length <= 14) d.type_document = false;
        else d.type_document = true;

        d.phone = extractNumbers(d.phone);
        d.phone_whatsapp = extractNumbers(d.phone_whatsapp);

        if (isEmpty(d.phone_whatsapp)) delete d.phone_whatsapp;

        const {
          state,
          neighborhood,
          city,
          postcode,
          street,
          number,
          complement
        } = d;

        d.addresses = {
          state,
          neighborhood,
          city,
          postcode,
          street,
          number,
          complement
        };

        await UsersService.updateByAdmin(id, d).then(res => {
          if (res.status !== 201 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
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
            <div className="SectionHeader__content">
              <Breadcrumb
                path={[
                  { route: '/', name: 'Home' },
                  { route: '/admin', name: 'Painel Administrativo' },
                  { route: '/admin/users', name: 'Usuários' },
                  {
                    route: `/admin/users/${id}/editar`,
                    name: `Editar`
                  }
                ]}
              />

              <h2>Editar Usuário {data && `(${data.name})`}</h2>
              <p>Aqui você irá editar o usuário em questão</p>

              <Link href={`/admin/users/${id}/editar/senha`}>
                <Button className="primary">
                  <FontAwesomeIcon icon={faKey} /> Alterar Senha
                </Button>
              </Link>
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
                  {(data && dataTypes && (
                    <>
                      <Input
                        type="text"
                        label="Nome"
                        name="name"
                        initialValue={data.name}
                        required
                      />
                      <Input
                        type="text"
                        label="E-mail"
                        name="email"
                        initialValue={data.email}
                        required
                      />
                      <Input
                        type="text"
                        label="Documento"
                        name="document"
                        initialValue={data.document}
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
                            initialValue={data.phone}
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
                            initialValue={data.phone_whatsapp || ''}
                          />
                        </div>
                      </div>
                      <Select
                        options={dataTypes?.typesUser.map(userType => ({
                          value: userType,
                          label: capitalize(userType)
                        }))}
                        label="Tipo de Usuário"
                        value={data.type}
                        name="type"
                        required
                      />
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="CEP"
                            name="postcode"
                            initialValue={data.addresses.postcode}
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
                            initialValue={data.addresses.state}
                            ref={stateRef}
                            required
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Cidade"
                            name="city"
                            initialValue={data.addresses.city}
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
                            initialValue={data.addresses.neighborhood}
                            ref={neighborhoodRef}
                            required
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Rua"
                            name="street"
                            initialValue={data.addresses.street}
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
                            initialValue={data.addresses.number}
                            required
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Complementos"
                            name="complement"
                            initialValue={data.addresses.complement || ''}
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
                    </>
                  )) || <Loader />}
                </form>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute(['administrador'])(AdminUsersEdit);

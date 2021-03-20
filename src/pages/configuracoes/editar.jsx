import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { Alert } from '@/components/Alert';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Error from '@/components/Error';
import Loader from '@/components/Loader';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import getFormData from '@/helpers/getFormData';
import { useFetch } from '@/hooks/useFetch';

import AddressesService from '@/services/AddressesService';
import UsersService from '@/services/UsersService';
import errorMessage from '@/helpers/errorMessage';
import extractNumbers from '@/helpers/extractNumbers';

const schema = yup.object().shape({
  name: yup
    .string()
    .min(4, 'O nome precisa ter no mínimo 4 caracteres')
    .required('O campo nome é obrigatório!'),
  phone: yup.string().required('O campo telefone é obrigatório!'),
  phone_whatsapp: yup.string(),
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

function ConfiguracoesEdit() {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const router = useRouter();
  const formRef = useRef(null);

  const { id } = useSelector(state => state.user);

  const { data, error, mutate } = useFetch(`/users/find/by/id/${id}`);

  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const neighborhoodRef = useRef(null);
  const streetRef = useRef(null);
  const postalcodeRef = useRef(null);

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        name: null,
        phone: null,
        phone_whatsapp: null,
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
      phone: null,
      phone_whatsapp: null,
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
      .then(async dataReq => {
        setLoading(true);

        dataReq.phone = extractNumbers(dataReq.phone);
        dataReq.phone_whatsapp = extractNumbers(dataReq.phone_whatsapp);

        if (!dataReq.phone_whatsapp) delete dataReq.phone_whatsapp;

        await UsersService.updateByOwner(dataReq).then(async res => {
          if (res.status >= 400 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
          } else {
            await AddressesService.update(data.addresses.id, dataReq).then(
              async res2 => {
                if (res2.status >= 400 || res2?.statusCode) {
                  setAlert({ type: 'error', message: errorMessage(res2) });
                  setTimeout(() => {
                    setDisableButton(false);
                  }, 1000);
                } else {
                  mutate();
                  setAlert({
                    type: 'success',
                    message: 'Dados alterados com sucesso!'
                  });
                }
              }
            );
          }

          setLoading(false);
        });
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
      });
  };

  if (error) return <Error />;

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
                  { route: '/configuracoes', name: 'Configurações' },
                  { route: '/configuracoes/editar', name: 'Editar Dados' }
                ]}
              />
              <h2>Editar dados</h2>
              <p>Edite abaixo os dados de sua conta.</p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                {(data && (
                  <form
                    id="editDataForm"
                    ref={formRef}
                    method="post"
                    onSubmit={event => handleSubmit(event)}
                  >
                    <Input
                      type="text"
                      label="Nome"
                      name="name"
                      initialValue={data.name}
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
                          initialValue={data?.phone_whatsapp || ''}
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
                          name="complements"
                          initialValue={data.addresses.complements || ''}
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
                          <Button className="primary" type="submit">
                            Salvar
                          </Button>
                        </div>
                      </div>
                    )) || <Loader />}
                  </form>
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

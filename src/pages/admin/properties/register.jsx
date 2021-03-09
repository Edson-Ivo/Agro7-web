import React, { useRef } from 'react';
import Head from 'next/head';
// import { useSelector } from 'react-redux';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';

import { privateRoute } from '@/components/PrivateRoute';
import getFormData from '@/helpers/getFormData';
import * as yup from 'yup';

import UsersServices from '@/services/UsersServices';

function Properties() {
  const formRef = useRef(null);

  const schema = yup.object().shape({
    name: yup
      .string()
      .min(4, 'O nome precisa ter no mínimo 4 caracteres')
      .required('O campo nome é obrigatório!'),
    area: yup.number().required().positive().integer().required(),
    type_dimension: yup.string().min(1).max(1).required(),
    type_owner: yup.string().min(1).required(),
    latitude: yup.number().required(),
    longitude: yup.number().required(),
    state: yup.string().min(2).max(15).required(),
    neighborhood: yup.string().min(2).max(50).required(),
    city: yup.string().min(2).max(50).required(),
    postcode: yup.string().min(9).max(9).required(),
    street: yup.string().min(4).max(50).required(),
    number: yup.number().required(),
    complements: yup.string().nullable()
  });

  const handleClearData = () => {};
  const handleSubmit = async e => {
    e.preventDefault();

    const formData = getFormData(e, {
      name: null,
      area: null,
      type_dimension: 'm',
      type_owner: 'proprietario',
      latitude: null,
      longitude: null,
      state: null,
      neighborhood: null,
      city: null,
      postcode: null,
      street: null,
      number: null,
      complements: null
    });

    schema
      .validate(formData)
      .catch(err => {
        console.log(err);
        console.log(err.name);
        console.log(err.errors);
      })
      .then(async data => {
        await UsersServices.createProperties(data).then(res => {
          if (res.status !== 200 || res?.statusCode) {
            alert('error');
          } else {
            alert('success');
          }
        });
      });
  };

  return (
    <>
      <Head>
        <title>Cadastrar propriedade - Agro7</title>
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
                  { route: '/properties', name: 'Propriedades' }
                ]}
              />
              <h2>Cadastre uma propriedade</h2>
              <p>Aqui você irá cadastrar uma propriedade</p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                <form
                  ref={formRef}
                  method="post"
                  onSubmit={event => handleSubmit(event)}
                >
                  <div className="form-group">
                    <div>
                      <Input
                        type="text"
                        label="Nome da propriedade"
                        name="name"
                        initialValue=""
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        label="Quem é você para esta propriedade?"
                        name="type_owner"
                        initialValue="proprietario"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div>
                      <Input
                        type="number"
                        label="Área"
                        name="area"
                        initialValue=""
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        label="Unidade"
                        name="type_dimension"
                        initialValue="m"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div>
                      <Input
                        type="number"
                        label="Latitude"
                        name="latitude"
                        initialValue=""
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        label="Longitude"
                        name="longitude"
                        initialValue=""
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div>
                      <Input
                        type="text"
                        label="Estado"
                        name="state"
                        initialValue=""
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        label="Cidade"
                        name="city"
                        initialValue=""
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        label="CEP"
                        name="postcode"
                        initialValue=""
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
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        label="Rua"
                        name="street"
                        initialValue=""
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div>
                      <Input
                        type="number"
                        label="Número"
                        name="number"
                        initialValue=""
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
                      <Button onClick={handleClearData}>Limpar dados</Button>
                    </div>
                    <div>
                      <Button className="primary" type="submit">
                        Cadastrar usuário
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

export default privateRoute(['administrator'])(Properties);

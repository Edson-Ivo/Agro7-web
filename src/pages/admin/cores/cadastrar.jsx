import React, { useState, useRef } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import errorMessage from '@/helpers/errorMessage';
import ColorsService from '@/services/ColorsService';
import InputColor from '@/components/InputColor/index';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

const schema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório!'),
  hexadecimal: yup
    .string()
    .required('O campo escolha a cor é obrigatório!')
    .matches(
      '^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})',
      'Código hexadecimal da cor inválido'
    )
});

function AdminCoresCreate() {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const router = useRouter();
  const formRef = useRef(null);

  const handleSubmit = async data => {
    setDisableButton(true);

    schema
      .validate(data)
      .then(async d => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        d.hexadecimal = d.hexadecimal.replaceAll('#', '');

        await ColorsService.create(d).then(res => {
          if (res.status !== 201 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            setAlert({
              type: 'success',
              message: 'Cor cadastrada com sucesso!'
            });

            setTimeout(() => {
              router.push('/admin/cores/');
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

  return (
    <>
      <Head>
        <title>Painel Administrativo | Cadastrar Cor - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title="Cadastre uma Cor"
              description=" Aqui, você irá cadastrar uma cor para utilizar nas categorias do
                sistema"
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                <Form ref={formRef} method="post" onSubmit={handleSubmit}>
                  <Input type="text" label="Nome" name="name" required />
                  <InputColor name="hexadecimal" />

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
                        Cadastrar Cor
                      </Button>
                    </div>
                  </div>
                </Form>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute(['administrador'])(AdminCoresCreate);

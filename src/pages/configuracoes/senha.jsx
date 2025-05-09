import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as yup from 'yup';
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
import Loader from '@/components/Loader';

import UsersService from '@/services/UsersService';
import errorMessage from '@/helpers/errorMessage';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import scrollTo from '@/helpers/scrollTo';

const schema = yup.object().shape({
  password: yup.string().required('O campo Senha nova é obrigatório!'),
  repeat_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Confirme a nova senha corretamente!')
    .required('O campo Confirme a Nova senha é obrigatório!'),
  old_password: yup.string().required('O campo Senha atual é obrigatório!')
});

function ConfiguracoesSenha() {
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const alertRef = useRef(null);

  const handleSubmit = async dt => {
    setLoading(true);

    schema
      .validate(dt)
      .then(async d => {
        setAlertMsg({
          type: 'success',
          message: 'Enviando...'
        });

        scrollTo(alertRef);

        setLoading(true);

        delete d.repeat_password;

        await UsersService.updatePasswordByOwner(d).then(res => {
          if (res.status !== 200 || res?.statusCode) {
            setAlertMsg({ type: 'error', message: errorMessage(res) });
          } else {
            setAlertMsg({
              type: 'success',
              message: 'Senha alterada com sucesso!'
            });
          }

          setLoading(false);
        });
      })
      .catch(err => {
        setAlertMsg({ type: 'error', message: err.errors[0] });
        setLoading(false);

        if (err instanceof yup.ValidationError) {
          const { path, message } = err;

          formRef.current.setFieldError(path, message);
        }
      });
  };

  return (
    <>
      <Head>
        <title>Alterar Senha - Agro9</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title="Alterar senha"
              description="Modifique sua senha abaixo."
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alertMsg.message && (
                  <Alert type={alertMsg.type} ref={alertRef}>
                    {alertMsg.message}
                  </Alert>
                )}

                <Form method="post" ref={formRef} onSubmit={handleSubmit}>
                  <Input
                    type="password"
                    label="Senha atual"
                    name="old_password"
                    required
                  />
                  <Input
                    type="password"
                    label="Senha nova"
                    name="password"
                    required
                  />
                  <Input
                    type="password"
                    label="Confirme a nova senha"
                    name="repeat_password"
                    required
                  />
                  {(!loading && (
                    <div className="form-group buttons">
                      <div>
                        <Link href="/configuracoes">
                          <Button type="button">Cancelar</Button>
                        </Link>
                      </div>
                      <div>
                        <Button className="primary" type="submit">
                          Salvar nova senha
                        </Button>
                      </div>
                    </div>
                  )) || <Loader />}
                </Form>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(ConfiguracoesSenha);

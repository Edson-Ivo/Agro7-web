import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Form } from '@unform/web';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

import { useRouter } from 'next/router';
import Loader from '@/components/Loader/index';
import Container, { CenterContainer } from '@/components/Container';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Alert } from '@/components/Alert';

import AuthService from '@/services/AuthService';
import errorMessage from '@/helpers/errorMessage';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('O e-mail precisa ser um e-mail válido')
    .required('O campo e-mail é obrigatório!')
});

export default function EsqueceuSenha() {
  const formRef = useRef(null);
  const router = useRouter();

  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [loading, setLoading] = useState(false);

  const { id } = useSelector(state => state.user);

  const { email: queryEmail = '' } = router.query;

  if (id) router.push('/');

  const handleSubmit = async data => {
    setLoading(true);
    formRef.current.setErrors({});

    setAlertType('error');
    setAlertMsg('');

    schema
      .validate(data)
      .then(async d => {
        const { email } = d;

        await AuthService.forgotPassword(email).then(res => {
          if (res.status !== 201 || res?.statusCode) {
            setAlertMsg(errorMessage(res));
          } else {
            setAlertType('success');
            setAlertMsg('E-mail de recuperação de senha enviado com sucesso!');
          }

          setLoading(false);
        });
      })
      .catch(err => {
        setAlertMsg(err.errors[0]);
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
        <title>Esqueceu sua senha? - Agro7</title>
      </Head>

      <Container>
        <CenterContainer>
          <div className="CenterContainer__content">
            <div className="logoContainer">
              <Image
                src="/logo/logo.png"
                width="210"
                height="90"
                alt="Logotipo Agro7"
              />
            </div>
            <Form
              method="post"
              ref={formRef}
              onSubmit={handleSubmit}
              initialData={{ email: queryEmail }}
            >
              <h3 style={{ marginBottom: 8, marginTop: -16 }}>
                Esqueceu sua senha?
              </h3>
              <p style={{ marginBottom: 20 }}>
                Não se preocupe! Iremos te enviar um e-mail com um link para
                recuperá-la.
              </p>
              {alertMsg && <Alert type={alertType}>{alertMsg}</Alert>}

              <Input
                type="email"
                label="Insira aqui o e-mail de sua conta"
                name="email"
                autoComplete="off"
                required
                disabled={loading}
              />

              {(!loading && (
                <>
                  {alertType !== 'success' ? (
                    <Button className="primary loginButton" type="submit">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="loginIcon"
                      />{' '}
                      Enviar e-mail de recuperação
                    </Button>
                  ) : null}
                </>
              )) || <Loader />}
            </Form>
            <p className="text">
              <Link href="/login">Voltar ao login</Link>
            </p>
          </div>
        </CenterContainer>
      </Container>
    </>
  );
}

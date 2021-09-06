import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Form } from '@unform/web';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import Router from 'next/router';
import Loader from '@/components/Loader/index';
import Container, { CenterContainer } from '@/components/Container';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Alert } from '@/components/Alert';

import AuthService from '@/services/AuthService';
import { UserAuthAction } from '@/store/modules/User/actions';
import errorMessage from '@/helpers/errorMessage';

const schema = yup.object().shape({
  document: yup.string().required('Por favor, preencha o campo CPF ou CNPJ.'),
  password: yup.string().required('Por favor, preencha o campo senha.')
});

export default function Login() {
  const formRef = useRef(null);

  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { id } = useSelector(state => state.user);

  if (id) Router.push('/');

  const handleSubmit = async data => {
    setLoading(true);
    formRef.current.setErrors({});

    schema
      .validate(data)
      .then(async d => {
        const { document, password } = d;

        await AuthService.login(document, password).then(
          res => {
            dispatch(
              UserAuthAction({
                user: res.user
              })
            );

            Router.push('/');
          },
          error => {
            setLoading(false);
            setAlertMsg(errorMessage(error));
          }
        );
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
        <title>Acessar o sistema - Agro7</title>
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
            {alertMsg && <Alert>{alertMsg}</Alert>}
            <Form method="post" ref={formRef} onSubmit={handleSubmit}>
              <Input
                type="text"
                label="CPF ou CNPJ"
                name="document"
                inputMode="numeric"
                style={{ marginBottom: '16px' }}
                mask="cpf_cnpj"
                maxLength="18"
                autoComplete="off"
                required
                disabled={loading}
              />

              <Input
                type="password"
                label="Senha"
                name="password"
                style={{ marginBottom: '10px' }}
                autoComplete="off"
                required
                disabled={loading}
              />

              {(!loading && (
                <Button className="primary loginButton" type="submit">
                  <FontAwesomeIcon icon={faSignInAlt} className="loginIcon" />{' '}
                  Acessar o Sistema
                </Button>
              )) || <Loader />}
            </Form>
            <p className="text">
              <Link href="/recuperar-senha">Esqueceu sua senha?</Link>
            </p>
          </div>
        </CenterContainer>
      </Container>
    </>
  );
}

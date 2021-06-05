import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

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

export default function Login() {
  const [formData, setFormData] = useState({ document: null, password: null });
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { id } = useSelector(state => state.user);

  if (id) Router.push('/');

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const { document, password } = formData;

    if (document && password) {
      setLoading(true);

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
          const resMessage = errorMessage(error);

          setLoading(false);
          setAlertMsg(resMessage);
        }
      );
    } else {
      setAlertMsg('Preencha todos os campos!');
    }
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
            <form method="post" onSubmit={e => handleSubmit(e)}>
              <Input
                type="text"
                label="CPF ou CNPJ"
                name="document"
                style={{ marginBottom: '16px' }}
                mask="cpf_cnpj"
                maxLength="18"
                handleChange={e => handleChange(e)}
                autoComplete="off"
                required
              />

              <Input
                type="password"
                label="Senha"
                name="password"
                style={{ marginBottom: '10px' }}
                handleChange={e => handleChange(e)}
                autoComplete="off"
                required
              />
              {(!loading && (
                <Button className="primary loginButton" type="submit">
                  <FontAwesomeIcon icon={faSignInAlt} className="loginIcon" />{' '}
                  Acessar o Sistema
                </Button>
              )) || <Loader />}
            </form>
            <p className="text">
              <Link href="/recuperar-senha">Esqueceu sua senha?</Link>
            </p>
          </div>
        </CenterContainer>
      </Container>
    </>
  );
}

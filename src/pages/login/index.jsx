import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import Container, { CenterContainer } from '../../components/Container';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Alert } from '../../components/Alert';

import { AuthAction } from '../../store/modules/Auth/actions';

export default function Login() {
  const authData = useSelector(state => state.auth);

  const [formData, setFormData] = useState({ username: null, password: null });
  const [alertMsg, setAlertMsg] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    if (authData.isLoggedIn) {
      Router.push('/producer-notebook');
    }
  }, []);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    const { username, password } = formData;

    if (username && password) {
      dispatch(
        AuthAction({
          token: 'aa',
          user: { id: 1, name: 'aaa', email: 'aaa', rules: '1' }
        })
      );

      Router.push('/producer-notebook');
    } else {
      setAlertMsg('Preencha todos os campos!');
    }

    e.preventDefault();
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
              <Image src="/logo/logo.png" width="250" height="100" />
            </div>
            {alertMsg && <Alert>{alertMsg}</Alert>}
            <form method="post" onSubmit={e => handleSubmit(e)}>
              <Input
                type="text"
                label="CPF ou CNPJ"
                name="username"
                style={{ marginBottom: '16px' }}
                mask="cpf_cnpj"
                maxLength="18"
                handleChange={e => handleChange(e)}
                required
              />

              <Input
                type="password"
                label="Senha"
                name="password"
                style={{ marginBottom: '10px' }}
                handleChange={e => handleChange(e)}
                required
              />
              <Button className="active loginButton" type="submit">
                <FontAwesomeIcon icon={faSignInAlt} className="loginIcon" />{' '}
                Acessar o Sistema
              </Button>
            </form>
            <Link href="/forgot">Esqueceu sua senha?</Link>
          </div>
        </CenterContainer>
      </Container>
    </>
  );
}

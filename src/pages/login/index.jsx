import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import Router from 'next/router';
import Container, { CenterContainer } from '../../components/Container';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Alert } from '../../components/Alert';

import AuthService from '../../services/AuthService';
import errorMessage from '../../helpers/errorMessage';

export default function Login() {
  const [formData, setFormData] = useState({ username: null, password: null });
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    let { username, password } = formData;

    username = 'teste@teste.com';

    if (username && password) {
      setLoading(true);

      await AuthService.login(username, password).then(
        () => {
          Router.push('/caderno-produtor');
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
              <Image src="/logo/logo.png" width="210" height="90" />
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
              <Button className="primary loginButton" type="submit">
                <FontAwesomeIcon icon={faSignInAlt} className="loginIcon" />{' '}
                Acessar o Sistema
              </Button>
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

import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';

import Container, { CenterContainer } from '../../components/Container';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Alert } from '../../components/Alert';

export default function Login() {
  const [formData, setFormData] = useState({ username: null, password: null });
  const [alertMsg, setAlertMsg] = useState('');

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    const { username, password } = formData;

    if (username && password) {
      // Router.push('/');
    } else {
      setAlertMsg('Preencha todos os campos!');
    }

    e.preventDefault();
  };

  return (
    <>
      <Head>
        <title>Recuperar Senha - Agro7</title>
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

              <Button className="primary loginButton" type="submit">
                <FontAwesomeIcon icon={faKey} className="loginIcon" /> Recuperar
                senha
              </Button>
            </form>
            <p className="text">
              <Link href="/login">Voltar ao Login?</Link>
            </p>
          </div>
        </CenterContainer>
      </Container>
    </>
  );
}

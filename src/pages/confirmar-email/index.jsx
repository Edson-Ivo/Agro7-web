import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Form } from '@unform/web';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

import { useRouter } from 'next/router';
import Loader from '@/components/Loader/index';
import Container, { CenterContainer } from '@/components/Container';
import Button from '@/components/Button';
import { Alert } from '@/components/Alert';
import Error from '@/components/Error';

import AuthService from '@/services/AuthService';
import errorMessage from '@/helpers/errorMessage';

export default function ConfirmarEmail() {
  const formRef = useRef(null);
  const router = useRouter();

  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [loading, setLoading] = useState(false);

  const { id } = useSelector(state => state.user);

  const { token } = router.query;

  if (id) router.push('/');

  const handleSubmit = async () => {
    setLoading(true);
    formRef.current.setErrors({});

    setAlertType('success');
    setAlertMsg('Enviando solicitação...');

    await AuthService.confirmEmail(token).then(res => {
      if (res.status !== 201 || res?.statusCode) {
        setAlertType('error');
        setAlertMsg(errorMessage(res));
      } else {
        setAlertType('success');
        setAlertMsg(
          'Conta confirmada com sucesso! Você será redirecionado para o login em 2 segundos...'
        );

        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }

      setLoading(false);
    });
  };

  if (!token) return <Error error={405} />;

  return (
    <>
      <Head>
        <title>Confirmar E-mail - Agro7</title>
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
            <Form method="post" ref={formRef} onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: 8, marginTop: -16 }}>
                Confirmar e-mail
              </h3>
              <p style={{ marginBottom: 20 }}>
                Clique no botão abaixo para confirmar sua conta:
              </p>
              {alertMsg && <Alert type={alertType}>{alertMsg}</Alert>}

              {(!loading && (
                <>
                  {alertType !== 'success' ? (
                    <Button className="primary loginButton" type="submit">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="loginIcon"
                      />{' '}
                      Confirmar e-mail
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

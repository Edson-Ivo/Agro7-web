import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Form } from '@unform/web';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

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
import { captchaProvider } from '@/components/CaptchaProvider/index';
import LogoLoader from '@/components/Loader/LogoLoader';

function ConfirmarEmail() {
  const formRef = useRef(null);
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [reCaptcha, setReCaptcha] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [loading, setLoading] = useState(true);

  const { id } = useSelector(state => state.user);

  const { token } = router.query;

  if (id) router.push('/');

  const handleReCaptchaVerify = async () => {
    if (!executeRecaptcha) return;

    (async () => {
      try {
        const tokenCaptcha = await executeRecaptcha('login');

        setReCaptcha(tokenCaptcha);
        setLoading(false);
      } catch (error) {
        setAlertType('error');
        setAlertMsg(
          'Erro ao configurar o reCaptcha, por favor, tente novamente ou atualize a página.'
        );
      }
    })();
  };

  useEffect(() => {
    handleReCaptchaVerify();
  }, [executeRecaptcha]);

  const handleSubmit = async () => {
    setLoading(true);
    formRef.current.setErrors({});

    setAlertType('success');
    setAlertMsg('Enviando solicitação...');

    await handleReCaptchaVerify();

    await AuthService.confirmEmail(token, reCaptcha).then(res => {
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

  if (!reCaptcha) return <LogoLoader />;
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

export default captchaProvider(ConfirmarEmail);

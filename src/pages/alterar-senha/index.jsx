import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Form } from '@unform/web';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';

import { useRouter } from 'next/router';
import Loader from '@/components/Loader/index';
import Container, { CenterContainer } from '@/components/Container';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Error from '@/components/Error';
import { Alert } from '@/components/Alert';

import AuthService from '@/services/AuthService';
import errorMessage from '@/helpers/errorMessage';
import { captchaProvider } from '@/components/CaptchaProvider/index';
import LogoLoader from '@/components/Loader/LogoLoader';

const schema = yup.object().shape({
  password: yup.string().required('O campo nova senha é obrigatório!'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'As duas senhas devem ser iguais!')
    .required('O campo confirme a nova senha é obrigatório!')
});

function AlterarSenha() {
  const formRef = useRef(null);
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { token } = router.query;

  const [reCaptcha, setReCaptcha] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [loading, setLoading] = useState(false);

  const { id } = useSelector(state => state.user);

  if (id) router.push('/');

  const handleReCaptchaVerify = async () => {
    if (!executeRecaptcha) return;

    (async () => {
      try {
        const tokenCaptcha = await executeRecaptcha('login');

        setReCaptcha(tokenCaptcha);
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

  const handleSubmit = async data => {
    setLoading(true);
    formRef.current.setErrors({});

    setAlertType('error');
    setAlertMsg('');

    await handleReCaptchaVerify();

    schema
      .validate(data)
      .then(async d => {
        d.token = token;
        d.captcha = reCaptcha;

        await AuthService.changePassword(d).then(res => {
          if (res.status !== 201 || res?.statusCode) {
            setAlertMsg(errorMessage(res));
          } else {
            setAlertType('success');
            setAlertMsg(
              'Senha alterada com sucesso! Você será redirecionado para o login em 2 segundos...'
            );

            setTimeout(() => {
              router.push('/login');
            }, 2000);
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

  if (!reCaptcha) return <LogoLoader />;
  if (!token) return <Error error={405} />;

  return (
    <>
      <Head>
        <title>Alterar senha - Agro9</title>
      </Head>

      <Container>
        <CenterContainer>
          <div className="CenterContainer__content">
            <div className="logoContainer">
              <Image
                src="/logo/logo.png"
                width="210"
                height="90"
                alt="Logotipo Agro9"
              />
            </div>
            <Form method="post" ref={formRef} onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: 8, marginTop: -16 }}>Alterar senha</h3>
              {alertMsg && <Alert type={alertType}>{alertMsg}</Alert>}

              <Input
                type="password"
                label="Senha nova"
                name="password"
                autoComplete="off"
                required
                disabled={loading}
              />

              <Input
                type="password"
                label="Confirme a nova senha"
                name="confirm_password"
                autoComplete="off"
                required
                disabled={loading}
              />

              {(!loading && (
                <>
                  {alertType !== 'success' ? (
                    <Button className="primary loginButton" type="submit">
                      <FontAwesomeIcon icon={faKey} className="loginIcon" />{' '}
                      Salvar alteração
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

export default captchaProvider(AlterarSenha);

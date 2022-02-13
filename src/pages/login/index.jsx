import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Form } from '@unform/web';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import { useRouter } from 'next/router';
import Loader from '@/components/Loader/index';
import Container, { CenterContainer } from '@/components/Container';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { captchaProvider } from '@/components/CaptchaProvider';
import { Alert } from '@/components/Alert';

import AuthService from '@/services/AuthService';
import { UserAuthAction } from '@/store/modules/User/actions';
import errorMessage from '@/helpers/errorMessage';
import LogoLoader from '@/components/Loader/LogoLoader';

const schema = yup.object().shape({
  document: yup.string().required('Por favor, preencha o campo CPF ou CNPJ.'),
  password: yup.string().required('Por favor, preencha o campo senha.')
});

function Login() {
  const formRef = useRef(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();

  const [reCaptcha, setReCaptcha] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { id } = useSelector(state => state.user);

  if (id) router.push('/');

  const handleReCaptchaVerify = async () => {
    if (!executeRecaptcha) return;

    (async () => {
      try {
        const token = await executeRecaptcha('login');

        setReCaptcha(token);
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
    setAlertType('error');
    setAlertMsg('');

    formRef.current.setErrors({});

    await handleReCaptchaVerify();

    schema
      .validate(data)
      .then(async d => {
        const { document, password } = d;

        await AuthService.login(document, password, reCaptcha).then(
          ({ data: res, redirect }) => {
            dispatch(
              UserAuthAction({
                user: res.user
              })
            );

            router.push(redirect);
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

  if (!reCaptcha) return <LogoLoader />;

  return (
    <>
      <Head>
        <title>Acessar o sistema - Agro9</title>
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
            {alertMsg && <Alert type={alertType}>{alertMsg}</Alert>}
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
              <Link href="/esqueceu-senha">Esqueceu sua senha?</Link>
            </p>
          </div>
        </CenterContainer>
      </Container>
    </>
  );
}

export default captchaProvider(Login);

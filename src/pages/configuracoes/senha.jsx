import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Container from '../../components/Container';
import Nav from '../../components/Nav';
import Navbar from '../../components/Navbar';
import Breadcrumb from '../../components/Breadcrumb';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Alert } from '../../components/Alert';
import { Section, SectionHeader, SectionBody } from '../../components/Section';

import { CardContainer } from '../../components/CardContainer';
import { privateRoute } from '../../components/PrivateRoute';
import Loader from '../../components/Loader';

import UsersServices from '../../services/UsersServices';
import errorMessage from '../../helpers/errorMessage';
import getFormData from '../../helpers/getFormData';

function ConfiguracoesSenha() {
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        old_password: null,
        password: null,
        repeat_password: null
      };
    }

    return getFormData(formRef.current, {
      old_password: null,
      password: null,
      repeat_password: null
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const formData = getData();

    if (
      formData.old_password &&
      formData.password &&
      formData.repeat_password
    ) {
      if (formData.password === formData.repeat_password) {
        setLoading(true);

        delete formData.repeat_password;

        await UsersServices.updatePasswordByOwner(formData)
          .then(res => {
            if (res.status !== 200 || res?.statusCode) {
              setAlertMsg({ type: 'error', message: errorMessage(res) });
            } else {
              setAlertMsg({
                type: 'success',
                message: 'Senha alterada com sucesso!'
              });
            }

            setLoading(false);
          })
          .catch(err => {
            setAlertMsg({ type: 'error', message: err.errors[0] });
          });
      } else {
        setAlertMsg({
          type: 'error',
          message: 'Confirme a nova senha corretamente.'
        });
      }
    } else {
      setAlertMsg({
        type: 'error',
        message: 'Preencha todos os campos requeridos.'
      });
    }
  };

  return (
    <>
      <Head>
        <title>Alterar Senha - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              <Breadcrumb
                path={[
                  { route: '/', name: 'Home' },
                  { route: '/configuracoes', name: 'Configurações' },
                  { route: '/configuracoes/senha', name: 'Alterar senha' }
                ]}
              />
              <h2>Alterar senha</h2>
              <p>Modifique sua senha abaixo.</p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alertMsg.message && (
                  <Alert type={alertMsg.type}>{alertMsg.message}</Alert>
                )}

                <form
                  method="post"
                  ref={formRef}
                  onSubmit={event => handleSubmit(event)}
                >
                  <Input
                    type="password"
                    label="Senha atual"
                    name="old_password"
                    required
                  />
                  <Input
                    type="password"
                    label="Senha nova"
                    name="password"
                    required
                  />
                  <Input
                    type="password"
                    label="Confirme a nova senha"
                    name="repeat_password"
                    required
                  />
                  {(!loading && (
                    <div className="form-group buttons">
                      <div>
                        <Link href="/configuracoes">
                          <Button>Cancelar</Button>
                        </Link>
                      </div>
                      <div>
                        <Button className="primary" type="submit">
                          Salvar
                        </Button>
                      </div>
                    </div>
                  )) || <Loader />}
                </form>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(ConfiguracoesSenha);

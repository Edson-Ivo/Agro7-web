import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import UsersService from '@/services/UsersService';
import errorMessage from '@/helpers/errorMessage';
import Loader from '@/components/Loader/index';
import { useFetch } from '@/hooks/useFetch';
import Error from '@/components/Error/index';

const schema = yup.object().shape({
  password: yup.string().required('O campo Senha nova é obrigatório!'),
  repeat_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Confirme a nova senha corretamente!')
    .required('O campo Confirme a Nova senha é obrigatório!'),
  old_password: yup.string().required('O campo Senha atual é obrigatório!')
});

function AdminUsersEditPassword() {
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useFetch(`/users/find/by/id/${id}`);

  const handleSubmit = async dt => {
    setLoading(true);

    schema
      .validate(dt)
      .then(async d => {
        setAlertMsg({
          type: 'success',
          message: 'Enviando...'
        });

        setLoading(true);

        delete d.repeat_password;

        await UsersService.updatePasswordByAdmin(id, d).then(res => {
          if (res.status !== 200 || res?.statusCode) {
            setAlertMsg({ type: 'error', message: errorMessage(res) });
          } else {
            setAlertMsg({
              type: 'success',
              message: 'Senha alterada com sucesso!'
            });

            setTimeout(() => {
              router.push(`/admin/users/${id}/detalhes`);
            }, 1000);
          }

          setLoading(false);
        });
      })
      .catch(err => {
        setAlertMsg({ type: 'error', message: err.errors[0] });
        setLoading(false);

        if (err instanceof yup.ValidationError) {
          const { path, message } = err;

          formRef.current.setFieldError(path, message);
        }
      });
  };

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>Painel Administrativo | Editar Usuário - Agro7</title>
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
                  { route: '/admin', name: 'Painel Administrativo' },
                  { route: '/admin/users', name: 'Usuários' },
                  {
                    route: `/admin/users/${id}/editar`,
                    name: `Editar`
                  },
                  {
                    route: `/admin/users/${id}/editar/senha`,
                    name: `Alterar senha`
                  }
                ]}
              />

              <h2>Alterar Senha do Usuário {data && `(${data.name})`}</h2>
              <p>Aqui você irá alterar a senha do usuário em questão</p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alertMsg.message && (
                  <Alert type={alertMsg.type}>{alertMsg.message}</Alert>
                )}

                <Form method="post" ref={formRef} onSubmit={handleSubmit}>
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
                        <Button type="button" onClick={() => router.back()}>
                          Voltar
                        </Button>
                      </div>
                      <div>
                        <Button className="primary" type="submit">
                          Salvar
                        </Button>
                      </div>
                    </div>
                  )) || <Loader />}
                </Form>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute(['administrador'])(AdminUsersEditPassword);

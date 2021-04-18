import React, { useState, useRef } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import { useRouter } from 'next/router';

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
import NotFound from '@/components/NotFound';
import getFormData from '@/helpers/getFormData';
import errorMessage from '@/helpers/errorMessage';
import ColorsService from '@/services/ColorsService';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader/index';
import InputColor from '@/components/InputColor/index';

const schema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório!'),
  hexadecimal: yup
    .string()
    .required('O campo e-mail é obrigatório!')
    .matches(
      '^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})',
      'Código hexadecimal da cor inválido'
    )
});

function AdminCoresEdit({ permission }) {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const formRef = useRef(null);
  const router = useRouter();

  const { id } = router.query;
  const { data: dataColor, error, mutate } = useFetch(
    `/colors/find/by/id/${id}`
  );

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        name: null,
        hexadecimal: null
      };
    }

    return getFormData(formRef.current, {
      name: null,
      hexadecimal: null
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setDisableButton(true);
    schema
      .validate(getData())
      .then(async data => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        data.hexadecimal = data.hexadecimal.replaceAll('#', '');

        await ColorsService.create(data).then(res => {
          if (res.status !== 201 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            mutate();

            setAlert({
              type: 'success',
              message: 'Cor editada com sucesso!'
            });

            setTimeout(() => {
              router.push('/admin/cores/');
              setDisableButton(false);
            }, 1000);
          }
        });
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
        setDisableButton(false);
      });
  };

  if (!permission) return <NotFound />;

  return (
    <>
      {error && router.back()}
      <Head>
        <title>Painel Adminstrativo | Editar Cor - Agro7</title>
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
                  { route: '/admin', name: 'Painel Adminstrativo' },
                  { route: '/admin/cores', name: 'Cores para Categorias' },
                  {
                    route: `/admin/cores/${id}/editar`,
                    name: 'Editar'
                  }
                ]}
              />
              <h2>Editar Cor</h2>
              <p>Aqui você irá editar a cor em questão</p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                <form
                  id="registerForm"
                  ref={formRef}
                  method="post"
                  onSubmit={event => handleSubmit(event)}
                >
                  {(dataColor && (
                    <>
                      <Input
                        type="text"
                        label="Nome"
                        name="name"
                        initialValue={dataColor.name}
                        required
                      />
                      <InputColor
                        name="hexadecimal"
                        initialValue={`#${dataColor.hexadecimal}`}
                      />

                      <div className="form-group buttons">
                        <div>
                          <Button type="button" onClick={() => router.back()}>
                            Voltar
                          </Button>
                        </div>
                        <div>
                          <Button
                            disabled={disableButton}
                            className="primary"
                            type="submit"
                          >
                            Salvar
                          </Button>
                        </div>
                      </div>
                    </>
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

export default privateRoute(['administrator'])(AdminCoresEdit);

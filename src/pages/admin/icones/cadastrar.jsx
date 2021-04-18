import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as yup from 'yup';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import FileInput from '@/components/FileInput';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import NotFound from '@/components/NotFound';

import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';

import errorMessage from '@/helpers/errorMessage';
import getFormData from '@/helpers/getFormData';

import { useRouter } from 'next/router';
import TextArea from '@/components/TextArea/index';
import IconsService from '@/services/IconsService';

const schema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório!'),
  description: yup.string().nullable()
});

function AdminIconsCreate({ permission }) {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();

  useEffect(
    () => () => {
      setAlert({ type: '', message: '' });
      setDisableButton(false);
    },
    []
  );

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        name: null,
        description: null
      };
    }

    return getFormData(formRef.current, {
      name: null,
      description: null
    });
  };

  const handleCancel = () => {
    router.back();
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

        if (inputRef.current.error.message) {
          setAlert({ type: 'error', message: inputRef.current.error.message });
          setDisableButton(false);
        } else {
          const formData = new FormData();

          Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
          });

          formData.append('file', e.target.file.files[0]);

          await IconsService.create(formData).then(res => {
            if (res.status !== 201 || res?.statusCode) {
              setAlert({ type: 'error', message: errorMessage(res) });
              setTimeout(() => {
                setDisableButton(false);
              }, 1000);
            } else {
              setAlert({
                type: 'success',
                message: 'Ícone cadastrado com sucesso!'
              });

              setTimeout(() => {
                router.push(`/admin/icones/${res.data.id}/detalhes`);
                setDisableButton(false);
              }, 1000);
            }
          });
        }
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
        setDisableButton(false);
      });
  };

  if (!permission) return <NotFound />;

  return (
    <>
      <Head>
        <title>Painel Adminstrativo | Cadastrar Ícone - Agro7</title>
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
                  { route: '/admin/icones', name: 'Ícones para Categorias' },
                  {
                    route: '/admin/icones/cadastrar',
                    name: 'Cadastrar'
                  }
                ]}
              />
              <h2>Cadastrar Ícones</h2>
              <p>
                Aqui você irá cadastrar um ícone para utilizar nas categorias do
                sistema
              </p>
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
                  <Input type="text" name="name" label="Nome do ícone" />
                  <TextArea name="description" label="Descrição do ícone" />
                  <FileInput
                    ref={inputRef}
                    name="file"
                    label="Selecione a Imagem do Ícone"
                    extensions={['.jpg', '.jpeg', '.png', '.gif']}
                    max={1}
                  />

                  <div className="form-group buttons">
                    <div>
                      <Button type="button" onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </div>

                    <div>
                      <Button
                        disabled={disableButton}
                        className="primary"
                        type="submit"
                      >
                        Cadastrar ícone
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute(['administrator'])(AdminIconsCreate);

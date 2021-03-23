import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import FileInput from '@/components/FileInput';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';

import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';

import errorMessage from '@/helpers/errorMessage';

import ProductsService from '@/services/ProductsService';
import { useRouter } from 'next/router';
import TextArea from '@/components/TextArea/index';

function AdminProductsCreate() {
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

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setDisableButton(true);

    if (inputRef.current.error.message) {
      setAlert({ type: 'error', message: inputRef.current.error.message });
      setDisableButton(false);
    } else if (!e.target.name.value) {
      setAlert({
        type: 'error',
        message: 'Você precisa dar um nome para o produto'
      });
      setDisableButton(false);
    } else {
      const formData = new FormData();

      setAlert({
        type: 'success',
        message: 'Enviando...'
      });

      formData.append('name', e.target.name.value);
      formData.append('description', e.target.description.value);
      formData.append('file', e.target.file.files[0]);

      await ProductsService.create(formData)
        .then(res => {
          if (res.status !== 201 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            setAlert({
              type: 'success',
              message: 'Produto cadastrado com sucesso!'
            });

            setTimeout(() => {
              router.push(`/admin/produtos/${res.data.id}/detalhes`);
              setDisableButton(false);
            }, 1000);
          }
        })
        .catch(err => {
          setAlert({ type: 'error', message: err.errors[0] });
          setDisableButton(false);
        });
    }
  };

  return (
    <>
      <Head>
        <title>Painel Adminstrativo | Cadastrar Produto - Agro7</title>
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
                  { route: '/admin/produtos', name: 'Gerenciar Produtos' },
                  {
                    route: '/admin/produtos/cadastrar',
                    name: 'Cadastrar Produtos'
                  }
                ]}
              />
              <h2>Cadastrar Produtos</h2>
              <p>Aqui você irá cadastrar um produto no sistema</p>
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
                  <Input type="text" name="name" label="Nome do produto" />
                  <TextArea name="description" label="Descrição do produto" />
                  <FileInput
                    ref={inputRef}
                    name="file"
                    label="Selecione a Imagem do Produto"
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
                        Cadastrar Produto
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

export default privateRoute(['administrator'])(AdminProductsCreate);

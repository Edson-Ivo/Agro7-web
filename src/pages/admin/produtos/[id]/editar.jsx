import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

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
import TextArea from '@/components/TextArea/index';
import NotFound from '@/components/NotFound';

import errorMessage from '@/helpers/errorMessage';
import ProductsService from '@/services/ProductsService';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader/index';

function AdminProductsEdit({ permission }) {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();

  const { id } = router.query;
  const { data, error, mutate } = useFetch(`/products/find/by/id/${id}`);

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

    if (e.target.file.files.length > 0 && inputRef.current.error.message) {
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

      if (e.target.file.files.length > 0) {
        formData.append('file', e.target.file.files[0]);
      }

      await ProductsService.update(id, formData)
        .then(res => {
          if (res.status !== 201 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            mutate();

            setAlert({
              type: 'success',
              message: 'Produto editado com sucesso!'
            });

            setTimeout(() => {
              router.push(`/admin/produtos/${id}/detalhes`);
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

  if (!permission) return <NotFound />;

  return (
    <>
      {error && router.back()}
      <Head>
        <title>Painel Adminstrativo | Editar Produto - Agro7</title>
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
                  { route: '/admin/produtos', name: 'Gerenciar Produtos' }
                ]}
              />
              <h2>Editar Produto {`(${data && data.name})`}</h2>
              <p>Aqui você irá editar o produto em questão</p>
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
                  {(data && (
                    <>
                      <Input
                        type="text"
                        name="name"
                        label="Nome do produto"
                        initialValue={data.name}
                      />
                      <TextArea
                        name="description"
                        label="Descrição do produto"
                        initialValue={data.description}
                      />
                      <Input
                        type="text"
                        name="image"
                        label="Imagem atual"
                        initialValue={data.url}
                        disabled
                      />
                      <FileInput
                        ref={inputRef}
                        name="file"
                        label="Selecione a Imagem do Produto"
                        extensions={['.jpg', '.jpeg', '.png', '.gif']}
                        max={1}
                        text="Clique aqui para substituir a imagem atual ou apenas arraste-a."
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
                            Editar Produto
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

export default privateRoute(['administrator'])(AdminProductsEdit);

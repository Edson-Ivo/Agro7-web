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
import Error from '@/components/Error';

import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';

import errorMessage from '@/helpers/errorMessage';
import getFormData from '@/helpers/getFormData';

import { useRouter } from 'next/router';
import TextArea from '@/components/TextArea/index';
import IconsService from '@/services/IconsService';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader/index';

const schema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório!'),
  description: yup.string().nullable()
});

function AdminIconsEdit() {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();

  const { id } = router.query;
  const { data: dataIcon, error, mutate } = useFetch(`/icons/find/by/id/${id}`);

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
      .then(async dataEdit => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        if (e.target.file.files.length > 0 && inputRef.current.error.message) {
          setAlert({ type: 'error', message: inputRef.current.error.message });
          setDisableButton(false);
        } else {
          const formData = new FormData();

          formData.append('name', dataEdit.name);
          formData.append('description', dataEdit.description);

          if (e.target.file.files.length > 0) {
            formData.append('file', e.target.file.files[0]);
          }

          await IconsService.update(id, formData).then(res => {
            if (res.status !== 200 || res?.statusCode) {
              setAlert({ type: 'error', message: errorMessage(res) });
              setTimeout(() => {
                setDisableButton(false);
              }, 1000);
            } else {
              mutate();

              setAlert({
                type: 'success',
                message: 'Ícone editado com sucesso!'
              });

              setTimeout(() => {
                router.push(`/admin/icones/${id}/detalhes`);
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

  return (
    <>
      {error && router.back()}
      <Head>
        <title>Painel Adminstrativo | Editar Ícone - Agro7</title>
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
                    route: `/admin/icons/${id}/editar`,
                    name: 'Editar'
                  }
                ]}
              />
              <h2>Editar Ícone</h2>
              <p>Aqui você irá editar o ícone em questão</p>
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
                  {(dataIcon && (
                    <>
                      <Input
                        type="text"
                        name="name"
                        label="Nome do ícone"
                        initialValue={dataIcon.name}
                      />
                      <TextArea
                        name="description"
                        label="Descrição do ícone"
                        initialValue={dataIcon.description}
                      />
                      <Input
                        type="text"
                        name="image"
                        label="Imagem atual"
                        initialValue={dataIcon.url}
                        disabled
                      />
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

export default privateRoute(['administrator'])(AdminIconsEdit);

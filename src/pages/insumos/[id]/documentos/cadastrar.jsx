import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import InputFile from '@/components/InputFile';

import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';

import errorMessage from '@/helpers/errorMessage';

import { useFetch } from '@/hooks/useFetch';
import { useRouter } from 'next/router';
import Error from '@/components/Error/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import scrollTo from '@/helpers/scrollTo';
import SuppliesService from '@/services/SuppliesService';
import usersTypes from '@/helpers/usersTypes';
import useRewriteRoute from '@/hooks/useRewriteRoute';

const schema = yup.object().shape({
  name: yup.string().required('Você precisa dar um nome para o documento')
});

function SupplyDocumentosCreate() {
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const inputRef = useRef(null);

  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useFetch(`/supplies/find/by/id/${id}`);

  const { path: routePath } = useRewriteRoute(router);

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
  }, []);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async dt => {
    setDisableButton(true);

    schema
      .validate(dt)
      .then(async d => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        scrollTo(alertRef);

        if (inputRef.current.error.message) {
          setAlert({ type: 'error', message: inputRef.current.error.message });
        } else {
          const formData = new FormData();

          setAlert({
            type: 'success',
            message: 'Enviando...'
          });

          formData.append('name', d.name);
          formData.append('file', inputRef.current.getFiles()[0]);

          await SuppliesService.createDocument(id, formData).then(res => {
            if (res.status !== 201 || res?.statusCode) {
              setAlert({ type: 'error', message: errorMessage(res) });
              setTimeout(() => {
                setDisableButton(false);
              }, 1000);
            } else {
              setAlert({
                type: 'success',
                message: 'Documento cadastrado com sucesso!'
              });

              setTimeout(() => {
                router.replace(`${routePath}/${id}/documentos/${res.data.id}`);
              }, 1000);
            }
          });
        }
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
        setDisableButton(false);
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
        <title>
          Cadastrar Documento para Insumo {data && data?.name} - Agro9
        </title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%insumo': data?.name
              }}
              title={`Cadastrar Documento para Insumo ${data?.name}`}
              description={`Aqui, você irá cadastrar um documento para o insumo ${data?.name}`}
              isLoading={isEmpty(data)}
            />
          </SectionHeader>

          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type} ref={alertRef}>
                    {alert.message}
                  </Alert>
                )}
                <Form ref={formRef} method="post" onSubmit={handleSubmit}>
                  <Input
                    type="text"
                    name="name"
                    label="Nome do documento"
                    required
                  />

                  <InputFile
                    name="file"
                    ref={inputRef}
                    label="Selecione um arquivo"
                    min={1}
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
                        Cadastrar Documento
                      </Button>
                    </div>
                  </div>
                </Form>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute([
  usersTypes[0],
  usersTypes[1],
  usersTypes[2],
  usersTypes[4]
])(SupplyDocumentosCreate);

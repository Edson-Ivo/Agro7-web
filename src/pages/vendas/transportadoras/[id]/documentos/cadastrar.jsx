import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import FileInput from '@/components/FileInput';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';

import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';

import errorMessage from '@/helpers/errorMessage';

import { useFetch } from '@/hooks/useFetch';
import { useRouter } from 'next/router';
import Error from '@/components/Error/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import SalesService from '@/services/SalesService';
import useRewriteRoute from '@/hooks/useRewriteRoute';
import scrollTo from '@/helpers/scrollTo';

const schema = yup.object().shape({
  name: yup.string().required('Você precisa dar um nome para o documento')
});

function VendasTransportadorasDocumentosCreate() {
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const inputRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();

  const { path: routePath } = useRewriteRoute(router);

  const { id, createSale } = router.query;

  const { data, error } = useFetch(`/transporters/find/by/id/${id}`);

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
  }, []);

  const handleCancel = () => {
    if (!createSale) {
      router.back();
    } else {
      router.replace(`${routePath}/${createSale}/detalhes`);
    }
  };

  const handleSubmit = async (dt, { reset }, e) => {
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
          formData.append('file', e.target.file.files[0]);

          await SalesService.createTransporterDocument(id, formData).then(
            res => {
              if (res.status !== 201 || res?.statusCode) {
                setAlert({ type: 'error', message: errorMessage(res) });
                setTimeout(() => {
                  setDisableButton(false);
                }, 1000);
              } else {
                setAlert({
                  type: 'success',
                  message: 'Documento da transportadora cadastrado com sucesso!'
                });

                if (!createSale) {
                  setTimeout(() => {
                    router.push(`${routePath}/transportadoras/${id}/detalhes`);
                    setDisableButton(false);
                  }, 1000);
                } else {
                  router.replace(`${routePath}/${createSale}/detalhes`);
                }
              }
            }
          );
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
        <title>Adicionar Documento para Transportadora - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%transportadora': data?.name
              }}
              title={`Adicionar Documento para ${data?.name}`}
              description={`Aqui, você irá adicionar um documento para o seu registro da transportadora ${data?.name}.`}
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
                  <FileInput
                    ref={inputRef}
                    name="file"
                    label="Selecione o arquivo"
                    max={1}
                  />
                  <div className="form-group buttons">
                    <div>
                      <Button type="button" onClick={handleCancel}>
                        {(createSale && 'Adicionar depois') || 'Cancelar'}
                      </Button>
                    </div>
                    <div>
                      <Button
                        disabled={disableButton}
                        className="primary"
                        type="submit"
                      >
                        Adicionar Documento
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

export default privateRoute()(VendasTransportadorasDocumentosCreate);

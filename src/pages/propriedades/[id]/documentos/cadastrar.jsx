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

import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';

import errorMessage from '@/helpers/errorMessage';

import { useFetch } from '@/hooks/useFetch';
import DocumentsService from '@/services/DocumentsService';
import Router, { useRouter } from 'next/router';

function DocumentosCreate() {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  useEffect(
    () => () => {
      setAlert({ type: '', message: '' });
      setDisableButton(false);
    },
    []
  );

  const handleSubmit = async e => {
    e.preventDefault();
    setDisableButton(true);

    setAlert({
      type: 'success',
      message: 'Enviando...'
    });

    const formData = new FormData(e.target);

    // await DocumentsService.create(formData)
    //   .then(res => {
    //     if (res.status !== 201 || res?.statusCode) {
    //       setAlert({ type: 'error', message: errorMessage(res) });
    //       setTimeout(() => {
    //         setDisableButton(false);
    //       }, 1000);
    //     } else {
    //       setAlert({
    //         type: 'success',
    //         message: 'Propriedade cadastrada com sucesso!'
    //       });

    //       setTimeout(() => {
    //         Router.push('/propriedades');
    //         setDisableButton(false);
    //       }, 1000);
    //     }
    //   })
    //   .catch(err => {
    //     setAlert({ type: 'error', message: err.errors[0] });
    //     setDisableButton(false);
    //   });
  };

  return (
    <>
      {error && router.back()}
      <Head>
        <title>Adicionar Documento - Agro7</title>
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
                  { route: '/propriedades', name: 'Propriedades' }
                ]}
              />
              <h2>Adicionar Documento {`(${data && data.name})`}</h2>
              <p>
                Aqui você irá adicionar um documento da propriedade{' '}
                {data && data.name}
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
                  <Input
                    type="text"
                    name="name"
                    label="Qual é tipo do documento?"
                  />
                  <FileInput
                    ref={inputRef}
                    name="fileinput"
                    label="Selecione o arquivo"
                    max={1}
                  />
                  <div className="form-group buttons">
                    <div>
                      <Button type="button" onClick={() => router.back()}>
                        Cancelar
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
                </form>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(DocumentosCreate);

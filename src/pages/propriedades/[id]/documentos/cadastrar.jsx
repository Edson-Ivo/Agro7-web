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
import InputDropzone from '@/components/InputDropzone';

import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';

import errorMessage from '@/helpers/errorMessage';

import { useFetch } from '@/hooks/useFetch';
import DocumentsService from '@/services/DocumentsService';
import { useRouter } from 'next/router';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import scrollTo from '@/helpers/scrollTo';
import useUserAccess from '@/hooks/useUserAccess';
import LogoLoader from '@/components/Loader/LogoLoader';

const schema = yup.object().shape({
  name: yup.string().required('Você precisa dar um nome para o documento')
});

function DocumentosCreate() {
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const inputRef = useRef(null);
  const filesRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();
  const { id, createProperty } = router.query;

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  const { type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  const [userAccess, loadingUserAccess] = useUserAccess(route, data?.users?.id);

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
    setRoute(urlRoute(router, type));
  }, []);

  const handleCancel = () => {
    if (!createProperty) {
      router.back();
    } else {
      router.replace(
        `${route.path}/${id}/talhoes/cadastrar?createProperty=true`
      );
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
        console.log(filesRef.current.getFiles());

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

          // await DocumentsService.create(id, formData).then(res => {
          //   if (res.status !== 201 || res?.statusCode) {
          //     setAlert({ type: 'error', message: errorMessage(res) });
          //     setTimeout(() => {
          //       setDisableButton(false);
          //     }, 1000);
          //   } else {
          //     setAlert({
          //       type: 'success',
          //       message: 'Documento cadastrado com sucesso!'
          //     });

          //     if (!createProperty) {
          //       setTimeout(() => {
          //         router.push(`${route.path}/${id}/detalhes`);
          //         setDisableButton(false);
          //       }, 1000);
          //     } else {
          //       router.replace(
          //         `${route.path}/${id}/talhoes/cadastrar?createProperty=true`
          //       );
          //     }
          //   }
          // });
        }
      })
      .catch(err => {
        // setAlert({ type: 'error', message: err.errors[0] });
        // setDisableButton(false);
        // if (err instanceof yup.ValidationError) {
        //   const { path, message } = err;
        //   formRef.current.setFieldError(path, message);
        // }
      });
  };

  if (loadingUserAccess) return <LogoLoader />;

  if (error) return <Error error={error} />;
  if (
    (!isEmpty(route) && !route.hasPermission) ||
    (!loadingUserAccess && !userAccess)
  )
    return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Cadastrar Documento - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%propriedade': data?.name
              }}
              title={`Cadastrar Documento ${data?.name}`}
              description={`Aqui, você irá cadastrar um documento para propriedade ${data?.name}`}
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
                  {/* <FileInput
                    ref={inputRef}
                    name="file"
                    label="Selecione o arquivo"
                    max={1}
                  /> */}
                  <InputDropzone name="teste" ref={filesRef} />
                  <div className="form-group buttons">
                    <div>
                      <Button type="button" onClick={handleCancel}>
                        {(createProperty && 'Cadastrar depois') || 'Cancelar'}
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

export default privateRoute()(DocumentosCreate);

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

import { Alert } from '@/components/Alert';
import Loader from '@/components/Loader';
import { privateRoute } from '@/components/PrivateRoute';

import { useFetch } from '@/hooks/useFetch';
import DocumentsService from '@/services/DocumentsService';
import { useRouter } from 'next/router';

function DocumentosEdit() {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();
  const { id, idDoc } = router.query;

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);
  const docs = useFetch(`/documents/find/by/id/${idDoc}`);

  const dataDocs = docs.data;
  const errorDocs = docs.error;

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

    if (e.target.file.files.length > 0 && inputRef.current.error.message) {
      setAlert({ type: 'error', message: inputRef.current.error.message });
    } else if (!e.target.name.value) {
      setAlert({
        type: 'error',
        message: 'Você precisa dar um nome para o documento'
      });
    } else {
      const formData = new FormData();

      setAlert({
        type: 'success',
        message: 'Enviando...'
      });

      formData.append('name', e.target.name.value);

      if (e.target.file.files.length > 0) {
        formData.append('file', e.target.file.files[0]);
      }

      await DocumentsService.update(idDoc, formData)
        .then(() => {
          setAlert({
            type: 'success',
            message: 'Documento editado com sucesso!'
          });
          setTimeout(() => {
            router.push(`/propriedades/${id}/detalhes`);
          }, 1000);
        })
        .catch(err => {
          setAlert({ type: 'error', message: err.errors[0] });
          setDisableButton(false);
        });
    }
  };

  return (
    <>
      {(error || errorDocs) && router.back()}
      <Head>
        <title>Editar Documento - Agro7</title>
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
                  { route: '/propriedades', name: 'Propriedades' },
                  {
                    route: `/propriedades/${id}/detalhes`,
                    name: `${data?.name}`
                  },
                  {
                    route: `/propriedades/${id}/documentos/${idDoc}/cadastrar`,
                    name: 'Editar Documento'
                  }
                ]}
              />
              <h2>Editar Documento {dataDocs && dataDocs.name}</h2>
              <p>
                Você está editando o documento {dataDocs && dataDocs.name} da
                propriedade {data && data.name}.
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
                  {(dataDocs && (
                    <>
                      <Input
                        type="text"
                        name="name"
                        label="Nome do documento"
                        initialValue={dataDocs.name}
                      />
                      <Input
                        type="text"
                        name="archive"
                        label="Documento atual"
                        initialValue={dataDocs.filename}
                        disabled
                      />
                      <FileInput
                        ref={inputRef}
                        name="file"
                        label="Selecione o arquivo"
                        max={1}
                        text="Clique aqui para substituir o documento atual ou apenas arraste-o."
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
                            Editar Documento
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

export default privateRoute()(DocumentosEdit);

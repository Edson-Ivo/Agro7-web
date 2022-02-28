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

import { Alert } from '@/components/Alert';
import Loader from '@/components/Loader';
import { privateRoute } from '@/components/PrivateRoute';

import { useFetch } from '@/hooks/useFetch';
import { useRouter } from 'next/router';
import Error from '@/components/Error/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import downloadDocument from '@/helpers/downloadDocument';
import scrollTo from '@/helpers/scrollTo';
import InputFile from '@/components/InputFile/index';
import usersTypes from '@/helpers/usersTypes';
import SuppliesService from '@/services/SuppliesService';
import useRewriteRoute from '@/hooks/useRewriteRoute';

const schema = yup.object().shape({
  name: yup.string().required('Você precisa dar um nome para o documento')
});

function DocumentosEdit() {
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const inputRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();
  const { id, docId } = router.query;

  const { data, error } = useFetch(`/supplies/find/by/id/${id}`);
  const { data: dataDocs, error: errorDocs } = useFetch(
    `/supplies-documents/find/by/id/${docId}`
  );

  const { path: routePath } = useRewriteRoute(router);

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
  }, []);

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

        const inputDocumentFile = inputRef.current.getFiles();

        if (inputDocumentFile.length > 0 && inputRef.current.error.message) {
          setAlert({ type: 'error', message: inputRef.current.error.message });
        } else {
          const formData = new FormData();

          setAlert({
            type: 'success',
            message: 'Enviando...'
          });

          formData.append('name', d.name);

          if (inputDocumentFile.length > 0)
            formData.append('file', inputDocumentFile[0]);

          await SuppliesService.updateDocument(docId, formData).then(() => {
            setAlert({
              type: 'success',
              message: 'Documento editado com sucesso!'
            });

            setTimeout(() => {
              router.push(`${routePath}/${id}/documentos/${docId}/detalhes`);
            }, 1000);
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

  if (error || errorDocs) return <Error error={error || errorDocs} />;

  return (
    <>
      <Head>
        <title>Editar Documento do Insumo - Agro9</title>
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
              title={`Editar Documento ${dataDocs?.name}`}
              description={`Você está editando o documento ${dataDocs?.name} do insumo ${data?.name}.`}
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

                {(dataDocs && (
                  <>
                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmit}
                      initialData={{ ...dataDocs }}
                    >
                      <Input
                        type="text"
                        name="name"
                        label="Nome do documento"
                      />

                      <Button
                        type="button"
                        onClick={() => downloadDocument(dataDocs?.url)}
                        style={{ marginBottom: 20 }}
                      >
                        Clique aqui para ver o documento atual
                      </Button>

                      <InputFile
                        name="file"
                        ref={inputRef}
                        label="Selecione um arquivo para substituir o atual"
                        min={0}
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
                            Salvar Edição
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </>
                )) || <Loader />}
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
])(DocumentosEdit);

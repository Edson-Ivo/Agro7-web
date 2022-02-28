import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
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
import usersTypes from '@/helpers/usersTypes';
import DocumentsViewer from '@/components/DocumentsViewer/index';
import useRewriteRoute from '@/hooks/useRewriteRoute';

function DocumentosDetails() {
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const router = useRouter();
  const { id, docId } = router.query;

  const { data, error } = useFetch(`/supplies/find/by/id/${id}`);
  const { data: dataDocs, error: errorDocs } = useFetch(
    `/supplies-documents/find/by/id/${docId}`
  );

  const { path: routePath } = useRewriteRoute(router);

  useEffect(() => {
    setAlert({ type: '', message: '' });
  }, []);

  if (error || errorDocs) return <Error error={error || errorDocs} />;

  return (
    <>
      <Head>
        <title>Documento do Insumo {data && data?.name} - Agro9</title>
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
              title={`Documento do Insumo ${dataDocs?.name}`}
              description={`Você irá visualizar o documento ${dataDocs?.name} do insumo ${data?.name}.`}
              isLoading={isEmpty(data) || isEmpty(dataDocs)}
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

                {(data && dataDocs && (
                  <>
                    <Form ref={formRef} initialData={{ ...dataDocs }}>
                      <Input
                        type="text"
                        name="name"
                        label="Nome do documento"
                        disabled
                      />

                      <DocumentsViewer
                        src={dataDocs?.url}
                        name={dataDocs?.name}
                      />

                      <div className="form-group buttons">
                        <div>
                          <Button type="button" onClick={() => router.back()}>
                            Voltar
                          </Button>
                        </div>
                        <div>
                          <Button
                            className="primary"
                            type="button"
                            onClick={() => {
                              router.push(
                                `${routePath}/${id}/documentos/${docId}/editar`
                              );
                            }}
                          >
                            Editar
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
])(DocumentosDetails);

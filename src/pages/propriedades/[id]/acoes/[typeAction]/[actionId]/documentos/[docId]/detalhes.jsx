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

import { privateRoute } from '@/components/PrivateRoute';

import { useFetch } from '@/hooks/useFetch';
import { useRouter } from 'next/router';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import PropertiesActionsService, {
  actionsList
} from '@/services/PropertiesActionsService';
import objectKeyExists from '@/helpers/objectKeyExists';
import usersTypes from '@/helpers/usersTypes';
import DocumentsViewer from '@/components/DocumentsViewer/index';
import Loader from '@/components/Loader/index';

function AcoesPropriedadeDocumentosDetalhes() {
  const formRef = useRef(null);
  const [baseUrl, setBaseUrl] = useState('');

  const router = useRouter();
  const { id, actionId, typeAction, docId } = router.query;

  const requestAction = PropertiesActionsService.requestAction(typeAction);

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  const { error: errorActions } = useFetch(
    `/${requestAction}/find/by/id/${actionId}`
  );

  const { data: dataDocs, error: errorDocs } = useFetch(
    actionsList[typeAction]?.documents
      ? `/${requestAction}-documents/find/by/id/${docId}`
      : null
  );

  const { type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  useEffect(() => {
    setRoute(urlRoute(router, type, [usersTypes[3], usersTypes[4]]));
  }, []);

  useEffect(() => {
    if (!isEmpty(route?.path))
      setBaseUrl(`${route.path}/${id}/acoes/${typeAction}`);
  }, [route]);

  if (error || errorActions || errorDocs)
    return <Error error={error || errorActions || errorDocs} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;
  if (
    !objectKeyExists(actionsList, typeAction) ||
    !actionsList[typeAction]?.documents
  )
    return <Error error={404} />;

  return (
    <>
      <Head>
        <title>
          Documento da Ação de {actionsList[typeAction]?.label} da Ação da
          Propriedade {data && data?.name}- Agro9
        </title>
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
              title={`Documento ${dataDocs?.name} na Ação de ${actionsList[typeAction]?.label} da Propriedade  ${data?.name}`}
              description={`Aqui, você irá visualizar o documento ${
                dataDocs?.name
              } para a ação ${actionsList[
                typeAction
              ]?.label.toLowerCase()} da propriedade ${data?.name}.`}
              isLoading={isEmpty(data) || isEmpty(dataDocs)}
            />
          </SectionHeader>

          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(dataDocs && (
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
                              `${baseUrl}/${actionId}/documentos/${docId}/editar`
                            );
                          }}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  </Form>
                )) || <Loader />}
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(AcoesPropriedadeDocumentosDetalhes);

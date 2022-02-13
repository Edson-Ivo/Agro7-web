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
import CulturesActionsService, {
  actionsList
} from '@/services/CulturesActionsService';
import objectKeyExists from '@/helpers/objectKeyExists';
import usersTypes from '@/helpers/usersTypes';
import DocumentsViewer from '@/components/DocumentsViewer/index';
import Loader from '@/components/Loader/index';

function AcoesCulturasDocumentosCreate() {
  const formRef = useRef(null);
  const [baseUrl, setBaseUrl] = useState('');

  const router = useRouter();
  const { id, fieldId, cultureId, actionId, typeAction, docId } = router.query;

  const requestAction = CulturesActionsService.requestAction(typeAction);

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const { error: errorActions } = useFetch(
    `/${requestAction}/find/by/id/${actionId}`
  );

  const { data: dataDocs, error: errorDocs } = useFetch(
    `/${requestAction}-documents/find/by/id/${docId}`
  );

  const { type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  useEffect(() => {
    setRoute(urlRoute(router, type, [usersTypes[3], usersTypes[4]]));
  }, []);

  useEffect(() => {
    if (!isEmpty(route?.path))
      setBaseUrl(
        `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/acoes/${typeAction}`
      );
  }, [route]);

  if (error || errorCultures || errorActions || errorDocs)
    return (
      <Error error={error || errorCultures || errorActions || errorDocs} />
    );
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && fieldId !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
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
          Editar Documento da Ação de {actionsList[typeAction]?.label} na
          Cultura {dataCultures?.products?.name} - Agro9
        </title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%propriedade': data?.properties.name,
                '%talhao': data?.name,
                '%cultura': dataCultures?.products?.name
              }}
              title={`Editar Documento ${dataDocs?.name} na Ação de ${actionsList[typeAction]?.label} na
              Cultura ${dataCultures?.products?.name}`}
              description={`Aqui, você irá editar o documento ${
                dataDocs?.name
              } para a ação ${actionsList[
                typeAction
              ]?.label.toLowerCase()} em questão da cultura de ${
                dataCultures?.products?.name
              } do talhão ${data?.name} da propriedade ${
                data?.properties?.name
              }.`}
              isLoading={
                isEmpty(data) || isEmpty(dataCultures) || isEmpty(dataDocs)
              }
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

export default privateRoute()(AcoesCulturasDocumentosCreate);

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

import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';

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
import downloadDocument from '@/helpers/downloadDocument';
import scrollTo from '@/helpers/scrollTo';
import usersTypes from '@/helpers/usersTypes';
import InputFile from '@/components/InputFile/index';
import Loader from '@/components/Loader/index';

const schema = yup.object().shape({
  name: yup.string().required('Você precisa dar um nome para o documento')
});

function AcoesPropriedadeDocumentosCreate() {
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const inputRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
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

          await PropertiesActionsService.updateDocument(
            docId,
            formData,
            typeAction
          ).then(() => {
            setAlert({
              type: 'success',
              message: 'Documento editado com sucesso!'
            });

            setTimeout(() => {
              router.push(`${baseUrl}/${actionId}/detalhes`);
              setDisableButton(false);
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
          Editar Documento da Ação de {actionsList[typeAction]?.label} da Ação
          da Propriedade {data && data?.name}- Agro9
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
              title={`Editar Documento ${dataDocs?.name} na Ação de ${actionsList[typeAction]?.label} da Propriedade  ${data?.name}`}
              description={`Aqui, você irá editar o documento ${
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
                  <>
                    {alert.message !== '' && (
                      <Alert type={alert.type} ref={alertRef}>
                        {alert.message}
                      </Alert>
                    )}
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
                        required
                      />

                      <Button
                        type="button"
                        onClick={() => downloadDocument(dataDocs?.url)}
                        style={{ marginBottom: 20 }}
                      >
                        Clique aqui para ver o documento atual
                      </Button>

                      <InputFile
                        ref={inputRef}
                        name="file"
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

export default privateRoute()(AcoesPropriedadeDocumentosCreate);

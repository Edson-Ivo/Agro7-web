import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import { Form } from '@unform/web';
import { useSelector } from 'react-redux';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import errorMessage from '@/helpers/errorMessage';
import { useFetch } from '@/hooks/useFetch';
import { useRouter } from 'next/router';
import Error from '@/components/Error/index';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import PropertiesActionsService, {
  actionsList
} from '@/services/PropertiesActionsService';
import objectKeyExists from '@/helpers/objectKeyExists';
import scrollTo from '@/helpers/scrollTo';
import usersTypes from '@/helpers/usersTypes';
import InputFile from '@/components/InputFile/index';

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
  const { id, actionId, typeAction, createAction } = router.query;

  const requestAction = PropertiesActionsService.requestAction(typeAction);

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  const { error: errorActions } = useFetch(
    `/${requestAction}/find/by/id/${actionId}`
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

  const handleCancel = () => {
    if (!createAction) {
      router.back();
    } else {
      router.replace(`${baseUrl}/${actionId}/detalhes`);
    }
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

        const inputDocumentFile = inputRef.current.getFiles();

        if (inputRef.current.error.message) {
          setAlert({ type: 'error', message: inputRef.current.error.message });
        } else {
          const formData = new FormData();
          setAlert({
            type: 'success',
            message: 'Enviando...'
          });
          formData.append('name', d.name);
          formData.append('file', inputDocumentFile[0]);
          await PropertiesActionsService.createDocument(
            actionId,
            formData,
            typeAction
          ).then(res => {
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
                router.push(`${baseUrl}/${actionId}/detalhes`);
                setDisableButton(false);
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

  if (error || errorActions) return <Error error={error || errorActions} />;
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
          Cadastrar Documento para Ação de {actionsList[typeAction]?.label} da
          Ação da Propriedade {data && data?.name} - Agro9
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
              title={`Cadastrar Documento para Ação de ${actionsList[typeAction]?.label} na Propriedade ${data?.name}`}
              description={`Aqui, você irá cadastrar um documento para a ação ${actionsList[
                typeAction
              ]?.label.toLowerCase()} da propriedade ${data?.name}.`}
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
                    ref={inputRef}
                    name="file"
                    label="Selecione um arquivo"
                    min={0}
                    max={1}
                  />
                  <div className="form-group buttons">
                    <div>
                      <Button type="button" onClick={handleCancel}>
                        {(createAction && 'Cadastrar depois') || 'Cancelar'}
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

export default privateRoute()(AcoesPropriedadeDocumentosCreate);

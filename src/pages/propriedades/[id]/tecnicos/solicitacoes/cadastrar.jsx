import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import Loader from '@/components/Loader';

import errorMessage from '@/helpers/errorMessage';
import { useFetch } from '@/hooks/useFetch';
import isEmpty from '@/helpers/isEmpty';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import PropertiesService from '@/services/PropertiesService';
import SearchSelect from '@/components/SearchSelect/index';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import scrollTo from '@/helpers/scrollTo';

const schema = yup.object().shape({
  technicians: yup.string().required('Selecione um técnico primeiro.')
});

function TecnicosCadastrar() {
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [willAccess, setWillAccess] = useState(true);

  const router = useRouter();
  const { id } = router.query;

  const { id: userId, type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
    setRoute(urlRoute(router, type));
  }, []);

  useEffect(() => {
    if (data)
      setWillAccess(!(type === 'tecnico' && data?.users?.id !== userId));
  }, [data]);

  const handleCancel = () => {
    router.back();
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

        d.technicians = Number(d.technicians);
        d.properties = Number(id);

        await PropertiesService.createTechniciansPropertiesRequests(d).then(
          res => {
            if (res.status !== 201 || res?.statusCode) {
              setAlert({ type: 'error', message: errorMessage(res) });
              setTimeout(() => {
                setDisableButton(false);
              }, 1000);
            } else {
              setAlert({
                type: 'success',
                message:
                  'Técnico solicitado com sucesso, aguardando resposta...'
              });

              router.push(`${route.path}/${id}/tecnicos/solicitacoes`);
            }
          }
        );
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
  if ((!isEmpty(route) && !route.hasPermission) || !willAccess)
    return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Solicitar Técnico - Agro7</title>
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
              title={`Solicitar Técnico em ${data?.name}`}
              description={`Aqui, você irá solicitar um técnico para gerenciar a propriedade ${data?.name}`}
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

                {(data && (
                  <>
                    <Form ref={formRef} method="post" onSubmit={handleSubmit}>
                      <SearchSelect
                        name="technicians"
                        label="Digite o nome do técnico:"
                        url="/users/find/all/technicians"
                      />

                      <div className="form-group buttons">
                        <div>
                          <Button type="button" onClick={handleCancel}>
                            Cancelar
                          </Button>
                        </div>
                        <div>
                          <Button
                            disabled={disableButton}
                            className="primary"
                            type="submit"
                          >
                            Solicitar Técnico
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

export default privateRoute()(TecnicosCadastrar);

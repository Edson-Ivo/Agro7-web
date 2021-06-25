import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';
import Head from 'next/head';

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
import TechnicianActionsService from '@/services/TechnicianActionsService';
import TextArea from '@/components/TextArea';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

const schema = yup.object().shape({
  diagnostics: yup.string().required('O campo diagnóstico é obrigatório!'),
  cultivation: yup.string().required('O campo tratos culturais é obrigatório!'),
  fertilizing: yup.string().required('O campo adubação é obrigatório!'),
  plant_health: yup.string().required('O campo fitossanidade é obrigatório!')
});

function RelatoriosCreate() {
  const formRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();
  const { id, fieldId, cultureId } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const { type, id: userId } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
    setRoute(urlRoute(router, type));
  }, []);

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

        d.cultures = Number(cultureId);

        await TechnicianActionsService.create(d).then(res => {
          if (res.status !== 201 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            setAlert({
              type: 'success',
              message: 'Relatório Técnico adicionado com sucesso!'
            });

            setTimeout(() => {
              router.push(
                `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/relatorios/${res.data.id}/detalhes`
              );
              setDisableButton(false);
            }, 1000);
          }
        });
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

  if (error || errorCultures) return <Error error={error || errorCultures} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && fieldId !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;
  if (data && data?.properties?.users?.id === userId)
    return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Adicionar Relatório - Agro7</title>
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
              title={`Adicionar Relatório na Cultura de ${dataCultures?.products?.name}`}
              description={`Aqui você irá fazer um relatório da cultura de ${dataCultures?.products?.name} do talhão ${data?.name} da propriedade ${data?.properties?.name}.`}
              isLoading={isEmpty(data) || isEmpty(dataCultures)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}

                {(data && dataCultures && (
                  <>
                    <Form ref={formRef} method="post" onSubmit={handleSubmit}>
                      <TextArea
                        name="diagnostics"
                        label="Diagnóstico da Cultura"
                      />
                      <TextArea name="cultivation" label="Tratos Culturais" />
                      <TextArea name="fertilizing" label="Adubação" />
                      <TextArea name="plant_health" label="Fitossanidade" />

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
                            Adicionar Relatório
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

export default privateRoute(['tecnico', 'administrador'])(RelatoriosCreate);

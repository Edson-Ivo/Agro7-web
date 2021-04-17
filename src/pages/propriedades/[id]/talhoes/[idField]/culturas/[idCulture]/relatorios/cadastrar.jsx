import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import Loader from '@/components/Loader';

import errorMessage from '@/helpers/errorMessage';
import { useFetch } from '@/hooks/useFetch';
import getFormData from '@/helpers/getFormData';
import TechnicianActionsService from '@/services/TechnicianActionsService';
import TextArea from '@/components/TextArea';
import Select from '@/components/Select';

const schema = yup.object().shape({
  diagnostics: yup.string().required('O campo diagnóstico é obrigatório!'),
  adultery: yup.string().required('O campo Tratos Culturais é obrigatório!'),
  cultivation: yup.string().required('O campo tratos culturais é obrigatório!'),
  plant_health: yup.string().required('O campo fitossanidade é obrigatório!'),
  fertilizing: yup
    .mixed()
    .oneOf(['true', 'false'], 'O valor de está adubada é obrigatório')
    .required('O campo adubação é obrigatório')
});

function RelatoriosCreate() {
  const formRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();
  const { id, idField, idCulture } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${idField}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${idCulture}`
  );

  useEffect(
    () => () => {
      setAlert({ type: '', message: '' });
      setDisableButton(false);
    },
    []
  );

  const handleCancel = () => {
    router.back();
  };

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        diagnostics: null,
        adultery: null,
        cultivation: null,
        plant_health: null,
        fertilizing: true,
        cultures: null
      };
    }

    return getFormData(formRef.current, {
      diagnostics: null,
      adultery: null,
      cultivation: null,
      plant_health: null,
      fertilizing: true,
      cultures: null
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setDisableButton(true);
    schema
      .validate(getData())
      .then(async d => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        d.fertilizing = d.fertilizing === 'true';
        d.cultures = Number(idCulture);

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
                `/propriedades/${id}/talhoes/${idField}/culturas/${idCulture}/relatorios/${res.data.id}/detalhes`
              );
              setDisableButton(false);
            }, 1000);
          }
        });
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
        setDisableButton(false);
      });
  };

  return (
    <>
      {(error || errorCultures) && router.back()}
      {data && id !== data?.properties?.id.toString() && router.back()}
      {dataCultures &&
        idField !== dataCultures?.fields?.id.toString() &&
        router.back()}
      <Head>
        <title>Adicionar Relatório - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              {data && dataCultures && (
                <Breadcrumb
                  path={[
                    { route: '/', name: 'Home' },
                    { route: '/propriedades', name: 'Propriedades' },
                    {
                      route: `/propriedades/${id}/detalhes`,
                      name: `${data?.properties.name}`
                    },
                    {
                      route: `/propriedades/${id}/talhoes`,
                      name: `Talhões`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/detalhes`,
                      name: `${data?.name}`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/culturas`,
                      name: `Culturas`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/culturas/${idCulture}/detalhes`,
                      name: `${dataCultures?.products.name}`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/culturas/${idCulture}/relatorios`,
                      name: `Relatórios`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/culturas/${idCulture}/relatorios/cadastrar`,
                      name: `Adicionar`
                    }
                  ]}
                />
              )}
              <h2>
                Adicionar Relatório na Cultura de {dataCultures?.products.name}
              </h2>
              <p>
                Aqui você irá fazer um relatório da cultura de{' '}
                {dataCultures?.products.name} do talhão{' '}
                {`${data?.name} da propriedade ${data?.properties.name}`}.
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
                  {(data && dataCultures && (
                    <>
                      <TextArea
                        name="diagnostics"
                        label="Diagnóstico da Cultura"
                      />
                      <TextArea name="adultery" label="Tratos Culturais" />
                      <TextArea name="cultivation" label="Tratos Culturais" />
                      <Select
                        options={[
                          { value: 'true', label: 'Sim' },
                          { value: 'false', label: 'Não' }
                        ]}
                        label="Está adubada?"
                        name="fertilizing"
                      />
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

export default privateRoute()(RelatoriosCreate);

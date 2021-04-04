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
  adultery: yup.string().required('O campo #adultery é obrigatório!'),
  cultivation: yup.string().required('O campo tratos culturais é obrigatório!'),
  plant_health: yup.string().required('O campo fitossanidade é obrigatório!'),
  fertilizing: yup
    .mixed()
    .oneOf(['true', 'false'], 'O valor de está adubada é obrigatório')
    .required('O campo adubação é obrigatório')
});

function RelatoriosEdit() {
  const formRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();
  const { id, idField, idCulture, idAction } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${idField}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${idCulture}`
  );

  const {
    data: dataActions,
    error: errorActions,
    mutate: mutateActions
  } = useFetch(`/technician-actions/find/by/id/${idAction}`);

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

        await TechnicianActionsService.update(idAction, d).then(res => {
          if (res.status !== 200 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            mutateActions();

            setAlert({
              type: 'success',
              message: 'Relatório Técnico editado com sucesso!'
            });

            setTimeout(() => {
              router.push(
                `/propriedades/${id}/talhoes/${idField}/culturas/${idCulture}/relatorios/${idAction}/detalhes`
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
      {(error || errorCultures || errorActions) && router.back()}
      {data && id !== data?.properties?.id.toString() && router.back()}
      {dataCultures &&
        idField !== dataCultures?.fields?.id.toString() &&
        router.back()}
      <Head>
        <title>Editar Relatório - Agro7</title>
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
                  { route: '/propriedades', name: 'Propriedades' }
                ]}
              />
              <h2>
                Editar Relatório na Cultura de {dataCultures?.products.name}
              </h2>
              <p>
                Aqui você irá editar o relatório da cultura de{' '}
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
                  {(data && dataCultures && dataActions && (
                    <>
                      <TextArea
                        name="diagnostics"
                        label="Diagnóstico da Cultura"
                        initialValue={dataActions?.diagnostics}
                      />
                      <TextArea
                        name="adultery"
                        label="#adultery da Cultura"
                        initialValue={dataActions?.adultery}
                      />
                      <TextArea
                        name="cultivation"
                        label="Tratos Culturais"
                        initialValue={dataActions?.cultivation}
                      />
                      <Select
                        options={[
                          { value: 'true', label: 'Sim' },
                          { value: 'false', label: 'Não' }
                        ]}
                        label="Está adubada?"
                        name="fertilizing"
                        value={dataActions?.fertilizing.toString()}
                      />
                      <TextArea
                        name="plant_health"
                        label="Fitossanidade"
                        initialValue={dataActions?.plant_health}
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
                            Editar Relatório
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

export default privateRoute()(RelatoriosEdit);

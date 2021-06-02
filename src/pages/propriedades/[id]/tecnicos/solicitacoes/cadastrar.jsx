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
import isEmpty from '@/helpers/isEmpty';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import PropertiesService from '@/services/PropertiesService';
import SearchSelect from '@/components/SearchSelect/index';

const schema = yup.object().shape({
  technicians: yup.string().required('Selecione um técnico primeiro.')
});

function TecnicosCadastrar() {
  const formRef = useRef(null);
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

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        technicians: null
      };
    }

    return getFormData(formRef.current, {
      technicians: null
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
            <div className="SectionHeader__content">
              {data && (
                <Breadcrumb
                  path={[
                    { route: '/', name: 'Home' },
                    {
                      route: '/tecnico',
                      name: 'Painel Técnico',
                      active: type === 'tecnico' && route?.permission === type
                    },
                    {
                      route: '/admin',
                      name: 'Painel Administrativo',
                      active:
                        type === 'administrador' && route?.permission === type
                    },
                    { route: `${route.path}`, name: 'Propriedades' },
                    {
                      route: `${route.path}/${id}/detalhes`,
                      name: `${data?.name}`
                    },
                    {
                      route: `${route.path}/${id}/tecnicos`,
                      name: `Técnicos Relacionados`
                    },
                    {
                      route: `${route.path}/${id}/tecnicos/solicitacoes/cadastrar`,
                      name: `Solicitar Técnico`
                    }
                  ]}
                />
              )}
              <h2>Solicitar Técnico {`(${data && data.name})`}</h2>
              <p>
                Aqui você irá solicitar um técnico para gerenciar a propriedade{' '}
                {data && data.name}
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
                  {(data && (
                    <>
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

export default privateRoute()(TecnicosCadastrar);

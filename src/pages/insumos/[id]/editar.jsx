import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';

import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert/index';

import errorMessage from '@/helpers/errorMessage';

import { useRouter } from 'next/router';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader/index';
import Error from '@/components/Error/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

import scrollTo from '@/helpers/scrollTo';
import SuppliesService from '@/services/SuppliesService';
import ActionsForm from '@/components/ActionsForm/index';
import usersTypes from '@/helpers/usersTypes';
import useRewriteRoute from '@/hooks/useRewriteRoute';

function SupplyEdit() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, mutate } = useFetch(`/supplies/find/by/id/${id}`);

  const formRef = useRef(null);
  const alertRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const { path: routePath } = useRewriteRoute(router);

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
  }, []);

  const handleCancel = e => {
    e.preventDefault();
    router.back();
  };

  const handleSubmit = async dt => {
    setDisableButton(true);

    SuppliesService.schema()
      .validate(dt)
      .then(async d => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        scrollTo(alertRef);

        await SuppliesService.update(id, d).then(async res => {
          if (res.status >= 400 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            mutate();

            setAlert({
              type: 'success',
              message: 'Insumo atualizado com sucesso!'
            });

            setTimeout(() => {
              router.push(`${routePath}/${id}/detalhes`);
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

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>Editando Insumo - Agro9</title>
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
              title={`Editar Insumo ${data?.name}`}
              description="Aqui, você irá editar o insumo em questão"
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
                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmit}
                      initialData={{
                        ...data
                      }}
                    >
                      <ActionsForm
                        typeAction="supplies"
                        dataAction={data}
                        editForm
                      />

                      <div className="form-group buttons">
                        <div>
                          <Button type="button" onClick={handleCancel}>
                            Voltar
                          </Button>
                        </div>

                        <div>
                          <Button
                            disabled={disableButton}
                            type="submit"
                            className="primary"
                          >
                            Salvar Alterações
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
])(SupplyEdit);

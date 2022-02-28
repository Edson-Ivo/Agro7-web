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
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import scrollTo from '@/helpers/scrollTo';
import usersTypes from '@/helpers/usersTypes';
import ActionsForm from '@/components/ActionsForm/index';
import SuppliesService from '@/services/SuppliesService';

function Supplies() {
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
  }, []);

  const handleCancel = e => {
    e.preventDefault();
    router.back();
  };

  const handleSubmit = async d => {
    setDisableButton(true);

    SuppliesService.schema()
      .validate(d)
      .then(async data => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        scrollTo(alertRef);

        await SuppliesService.create(data).then(res => {
          if (res.status !== 201 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            setAlert({
              type: 'success',
              message: 'Insumo cadastrado com sucesso!'
            });

            setTimeout(() => {
              router.replace(`/insumos/${res.data.id}/detalhes`);
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

  return (
    <>
      <Head>
        <title>Cadastrar Insumo - Agro9</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title="Cadastre um Insumo"
              description="Aqui, você irá cadastrar um insumo"
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
                  <ActionsForm typeAction="supplies" />

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
                        Cadastrar Insumo
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

export default privateRoute([
  usersTypes[0],
  usersTypes[1],
  usersTypes[2],
  usersTypes[4]
])(Supplies);

import React, { useState, useRef } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import errorMessage from '@/helpers/errorMessage';
import TextArea from '@/components/TextArea/index';
import { useFetch } from '@/hooks/useFetch';
import Error from '@/components/Error/index';
import Select from '@/components/Select/index';
import Loader from '@/components/Loader/index';
import ProducerNotebookService from '@/services/ProducerNotebookService';
import { dateToInput, dateToISOString } from '@/helpers/date';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import scrollTo from '@/helpers/scrollTo';

const schema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório!'),
  description: yup.string().nullable(),
  date: yup.string().required('O campo data é obrigatório!'),
  categories: yup.string().required('Selecione uma categoria')
});

function ProducerNotebookCreate() {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const router = useRouter();
  const formRef = useRef(null);
  const alertRef = useRef(null);

  const handleSubmit = async data => {
    setDisableButton(true);

    schema
      .validate(data)
      .then(async d => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        scrollTo(alertRef);

        d.date = dateToISOString(d.date);
        d.categories = Number(d.categories);

        await ProducerNotebookService.create(d).then(res => {
          if (res.status !== 201 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            setAlert({
              type: 'success',
              message: 'Anotação cadastrada com sucesso!'
            });

            setTimeout(() => {
              router.push(
                `/caderno-produtor?searchDate=${data.date.split('T')[0]}`
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

  const { data: dataCategories, error: errorCategories } = useFetch(
    `/categories/find/all?limit=30`
  );

  if (errorCategories) return <Error error={errorCategories} />;

  return (
    <>
      <Head>
        <title>Anotação Caderno do Produtor - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title="Anotar no Caderno"
              description="Aqui, você irá fazer uma anotação no seu Caderno do Produtor"
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

                {(dataCategories && (
                  <>
                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmit}
                      initialData={{ date: dateToInput() }}
                    >
                      <Input type="text" label="Nome" name="name" required />
                      <Select
                        options={dataCategories?.items.map(category => ({
                          value: category.id,
                          label: category.name
                        }))}
                        label="Selecionar categoria"
                        name="categories"
                        required
                      />
                      <Input type="date" label="Data" name="date" required />
                      <TextArea name="description" label="Descrição" required />
                      <div className="form-group buttons">
                        <div>
                          <Button type="button" onClick={() => router.back()}>
                            Voltar
                          </Button>
                        </div>
                        <div>
                          <Button
                            disabled={disableButton}
                            className="primary"
                            type="submit"
                          >
                            Adicionar Anotação
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

export default privateRoute()(ProducerNotebookCreate);

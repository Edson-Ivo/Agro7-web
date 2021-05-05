import React, { useState, useRef } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import { useRouter } from 'next/router';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import getFormData from '@/helpers/getFormData';
import errorMessage from '@/helpers/errorMessage';
import TextArea from '@/components/TextArea/index';
import { useFetch } from '@/hooks/useFetch';
import Error from '@/components/Error/index';
import Select from '@/components/Select/index';
import Loader from '@/components/Loader/index';
import ProducerNotebookService from '@/services/ProducerNotebookService';
import { dateToInput, dateToISOString } from '@/helpers/date';

const schema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório!'),
  description: yup.string().nullable(),
  date: yup.string().required('O campo data é obrigatório!'),
  categories: yup.string().required('Selecione uma categoria')
});

function ProducerNotebookEdit() {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const router = useRouter();
  const formRef = useRef(null);

  const { id } = router.query;
  const { data, error, mutate } = useFetch(
    `/producer-notebook/find/by/id/${id}`
  );

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        name: null,
        description: null,
        date: null,
        categories: null
      };
    }

    return getFormData(formRef.current, {
      name: null,
      description: null,
      date: null,
      categories: null
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

        d.date = dateToISOString(d.date);
        d.categories = Number(d.categories);

        await ProducerNotebookService.update(id, d).then(res => {
          if (res.status !== 200 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            mutate();
            setAlert({
              type: 'success',
              message: 'Anotação editada com sucesso!'
            });

            setTimeout(() => {
              router.push(`/caderno-produtor/${id}/detalhes/`);
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

  const { data: dataCategories, error: errorCategories } = useFetch(
    `/categories/find/all?limit=30`
  );

  if (errorCategories || error)
    return <Error error={errorCategories || error} />;

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
            <div className="SectionHeader__content">
              <Breadcrumb
                path={[
                  { route: '/', name: 'Home' },
                  { route: '/caderno-produtor', name: 'Caderno do Produtor' },
                  {
                    route: `/caderno-produtor/${id}/editar`,
                    name: 'Editar Anotação'
                  }
                ]}
              />
              <h2>Editar Anotação</h2>
              <p>
                Aqui você irá editar uma anotação do seu Caderno do Produtor
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
                  {(data && dataCategories && (
                    <>
                      <Input
                        type="text"
                        label="Nome"
                        name="name"
                        initialValue={data.name}
                        required
                      />
                      <Select
                        options={dataCategories?.items.map(category => ({
                          value: category.id,
                          label: category.name
                        }))}
                        label="Selecionar categoria"
                        name="categories"
                        value={data.categories.id}
                        required
                      />
                      <Input
                        type="date"
                        label="Data"
                        name="date"
                        initialValue={dateToInput(data?.date)}
                        required
                      />
                      <TextArea
                        name="description"
                        label="Descrição"
                        initialValue={data?.description}
                        required
                      />
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
                            Salvar Edição
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

export default privateRoute()(ProducerNotebookEdit);

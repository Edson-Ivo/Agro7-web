import React, { useState, useRef, useEffect } from 'react';
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
import { dateConversor, dateToInput, dateToISOString } from '@/helpers/date';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';
import scrollTo from '@/helpers/scrollTo';

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
  const alertRef = useRef(null);

  const { id } = router.query;
  const { data: dataProducerNotebook, error, mutate } = useFetch(
    `/producer-notebook/find/by/id/${id}`
  );

  const { type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  useEffect(() => {
    setRoute(urlRoute(router, type));
  }, []);

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
              router.push(`${route.path}/${id}/detalhes/`);
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

  if (errorCategories || error)
    return <Error error={errorCategories || error} />;
  if (dataProducerNotebook?.is_log) return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

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
              breadcrumbTitles={{
                '%data': dateConversor(dataProducerNotebook?.date, false)
              }}
              title="Editar Anotação"
              description="Aqui, você irá editar uma anotação do seu Caderno do Produtor"
              isLoading={isEmpty(dataProducerNotebook)}
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

                {(dataProducerNotebook && dataCategories && (
                  <>
                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmit}
                      initialData={{
                        ...dataProducerNotebook,
                        categories: dataProducerNotebook.categories.id,
                        date: dateToInput(dataProducerNotebook?.date)
                      }}
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
                            Salvar Edição
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

export default privateRoute()(ProducerNotebookEdit);

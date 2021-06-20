import React, { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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
import { dateConversor, dateToInput } from '@/helpers/date';
import { useModal } from '@/hooks/useModal';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import isEmpty from '@/helpers/isEmpty';
import urlRoute from '@/helpers/urlRoute';
import { useSelector } from 'react-redux';

function ProducerNotebookDetails() {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const router = useRouter();
  const formRef = useRef(null);

  const { addModal, removeModal } = useModal();

  const { id } = router.query;

  const { data, mutate, error } = useFetch(
    `/producer-notebook/find/by/id/${id}`
  );

  const { data: dataCategories, error: errorCategories } = useFetch(
    `/categories/find/all?limit=30`
  );

  const { id: userId, type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  useEffect(() => {
    setRoute(urlRoute(router, type));
  }, []);

  const handleDelete = useCallback(
    async identifier => {
      removeModal();

      await ProducerNotebookService.delete(identifier).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlert({ type: 'error', message: errorMessage(res) });
        } else {
          mutate();

          router.back();

          setAlert({
            type: 'success',
            message: 'A anotação foi deletada com sucesso!'
          });
        }
      });
    },
    [addModal, removeModal]
  );

  const handleDeleteModal = useCallback(() => {
    addModal({
      title: 'Deletar Anotação',
      text: 'Deseja realmente deletar esta anotação?',
      confirm: true,
      onConfirm: () => handleDelete(id),
      onCancel: removeModal
    });
  }, [addModal, removeModal]);

  if (errorCategories || error)
    return <Error error={errorCategories || error} />;
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
              breadcrumb={[
                { route: '/', name: 'Home' },
                { route: '/caderno-produtor', name: 'Caderno do Produtor' },
                {
                  route: `/caderno-produtor?searchDate=${dateToInput(
                    data?.date
                  )}`,
                  name: `${dateConversor(data?.date, false)}`
                },
                {
                  route: `/caderno-produtor/${id}/detalhes`,
                  name: 'Anotação'
                }
              ]}
              title="Anotação"
              description={`Você está visualizando a anotação "${data?.name}" do
                dia ${dateConversor(data?.date, false)} do seu Caderno do
                Produtor.`}
              isLoading={isEmpty(data)}
            >
              {!isEmpty(data) && !data.is_log && (
                <div className="buttons__container">
                  <Link href={`${route.path}/${id}/editar`}>
                    <Button className="primary">
                      <FontAwesomeIcon icon={faEdit} /> Editar Anotação
                    </Button>
                  </Link>

                  <Button
                    className="red"
                    type="button"
                    onClick={() => handleDeleteModal()}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Deletar Anotação
                  </Button>
                </div>
              )}
            </SectionHeaderContent>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                {(data && dataCategories && (
                  <>
                    <Form
                      ref={formRef}
                      initialData={{ ...data, date: dateToInput(data?.date) }}
                    >
                      <Input type="text" label="Nome" name="name" disabled />
                      <Select
                        options={dataCategories?.items.map(category => ({
                          value: category.id,
                          label: category.name
                        }))}
                        label="Categoria"
                        name="categories.id"
                        disabled
                      />
                      <Input type="date" label="Data" name="date" disabled />
                      <TextArea
                        name="description"
                        label="Descrição"
                        style={{ minHeight: 350 }}
                        disabled
                      />
                    </Form>
                    <div className="form-group buttons">
                      <div>
                        <Button type="button" onClick={() => router.back()}>
                          Voltar
                        </Button>
                      </div>
                    </div>
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

export default privateRoute()(ProducerNotebookDetails);

import React, { useCallback, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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
import errorMessage from '@/helpers/errorMessage';
import TextArea from '@/components/TextArea/index';
import { useFetch } from '@/hooks/useFetch';
import Error from '@/components/Error/index';
import Select from '@/components/Select/index';
import Loader from '@/components/Loader/index';
import ProducerNotebookService from '@/services/ProducerNotebookService';
import { dateConversor, dateToInput } from '@/helpers/date';
import { useModal } from '@/hooks/useModal';

function ProducerNotebookDetails() {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const router = useRouter();

  const { addModal, removeModal } = useModal();

  const { id } = router.query;

  const { data, mutate, error } = useFetch(
    `/producer-notebook/find/by/id/${id}`
  );

  const { data: dataCategories, error: errorCategories } = useFetch(
    `/categories/find/all?limit=30`
  );

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
              {data && (
                <Breadcrumb
                  path={[
                    { route: '/', name: 'Home' },
                    { route: '/caderno-produtor', name: 'Caderno do Produtor' },
                    {
                      route: `/caderno-produtor?searchDate=${dateToInput(
                        data.date
                      )}`,
                      name: `${dateConversor(data.date, false)}`
                    },
                    {
                      route: `/caderno-produtor/${id}/detalhes`,
                      name: 'Anotação'
                    }
                  ]}
                />
              )}
              <h2>Anotação</h2>
              <p>
                Você está visualizando a anotação &quot;{data?.name}&quot; do
                dia {dateConversor(data?.date, false)} do seu Caderno do
                Produtor.
              </p>
              {data && !data.is_log && (
                <div className="buttons__container">
                  <Link href={`/caderno-produtor/${id}/editar`}>
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
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                {(data && dataCategories && (
                  <>
                    <Input
                      type="text"
                      label="Nome"
                      name="name"
                      initialValue={data.name}
                      disabled
                    />
                    <Select
                      options={dataCategories?.items.map(category => ({
                        value: category.id,
                        label: category.name
                      }))}
                      label="Categoria"
                      name="categories"
                      value={data.categories.id}
                      disabled
                    />
                    <Input
                      type="date"
                      label="Data"
                      name="date"
                      initialValue={dateToInput(data?.date)}
                      disabled
                    />
                    <TextArea
                      name="description"
                      label="Descrição"
                      initialValue={data?.description}
                      disabled
                    />
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

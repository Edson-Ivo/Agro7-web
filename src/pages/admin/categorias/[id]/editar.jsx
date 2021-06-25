import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';
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
import Error from '@/components/Error';
import errorMessage from '@/helpers/errorMessage';
import CategoriesService from '@/services/CategoriesService';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader/index';
import TextArea from '@/components/TextArea/index';
import Pagination from '@/components/Pagination/index';
import ColorsContainer, { ColorsGrid } from '@/components/ColorsContainer';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import isEmpty from '@/helpers/isEmpty';

const schema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório!'),
  description: yup.string().nullable()
});

function AdminCategoriesEdit() {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const formRef = useRef(null);
  const router = useRouter();

  const { id } = router.query;

  const [pageColors, setPageColors] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);

  const perPage = 9;

  const { data: dataCategory, error: errorCategory } = useFetch(
    `/categories/find/by/id/${id}`
  );

  const { data: dataColors, error: errorColors } = useFetch(
    `/colors/find/all?limit=${perPage}&page=${pageColors}`
  );

  useEffect(() => {
    if (dataCategory) setSelectedColor(dataCategory.colors.id);
  }, [dataCategory]);

  const handleColors = colorId => {
    setSelectedColor(colorId);
  };

  const handleSubmit = async data => {
    setDisableButton(true);

    schema
      .validate(data)
      .then(async d => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        if (selectedColor === null) {
          setAlert({
            type: 'error',
            message: 'Selecione uma cor!'
          });
        } else {
          d.colors = selectedColor;

          await CategoriesService.update(id, d).then(res => {
            if (res.status !== 200 || res?.statusCode) {
              setAlert({ type: 'error', message: errorMessage(res) });
              setTimeout(() => {
                setDisableButton(false);
              }, 1000);
            } else {
              setAlert({
                type: 'success',
                message: 'Categoria editada com sucesso!'
              });

              setTimeout(() => {
                router.push(`/admin/categorias/${res.data.id}/detalhes`);
                setDisableButton(false);
              }, 1000);
            }
          });
        }
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

  if (errorColors || errorCategory)
    return <Error error={errorColors || errorCategory} />;

  return (
    <>
      <Head>
        <title>Painel Administrativo | Editar Categoria - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%categoria': dataCategory?.name
              }}
              title={`Editar Categoria ${dataCategory?.name}`}
              description="Aqui você irá editar a categoria em questão"
              isLoading={isEmpty(dataCategory)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}

                {(dataCategory && (
                  <>
                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmit}
                      initialData={{
                        ...dataCategory
                      }}
                    >
                      <MultiStep activeStep={activeStep}>
                        <Step label="Dados" onClick={() => setActiveStep(1)}>
                          <h4 className="step-title">Dados da Categoria</h4>
                          <Input type="text" label="Nome" name="name" />
                          <TextArea name="description" label="Descrição" />
                        </Step>
                        <Step label="Cor" onClick={() => setActiveStep(2)}>
                          <h4 className="step-title">Selecione a Cor</h4>
                          {(dataColors && (
                            <>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}
                              >
                                <ColorsGrid>
                                  {dataColors?.items &&
                                    dataColors.items.map(d => (
                                      <ColorsContainer
                                        key={d.id.toString()}
                                        onClick={() => handleColors(d.id)}
                                        selected={selectedColor === d.id}
                                        fillColor={d.hexadecimal}
                                        title={d.name}
                                        size={45}
                                      />
                                    ))}
                                </ColorsGrid>
                              </div>
                              <Pagination
                                setPage={setPageColors}
                                currentPage={pageColors}
                                itemsPerPage={perPage}
                                totalPages={dataColors.meta.totalPages}
                              />
                            </>
                          )) || <Loader />}
                        </Step>
                      </MultiStep>

                      <div className="form-group buttons">
                        {(activeStep !== 1 && (
                          <div>
                            <Button
                              type="button"
                              onClick={() => setActiveStep(activeStep - 1)}
                            >
                              Voltar
                            </Button>
                          </div>
                        )) || (
                          <div>
                            <Button type="button" onClick={() => router.back()}>
                              Cancelar
                            </Button>
                          </div>
                        )}
                        <div>
                          {activeStep !== 2 && (
                            <Button
                              type="button"
                              onClick={() => setActiveStep(activeStep + 1)}
                              className="primary"
                            >
                              Continuar
                            </Button>
                          )}

                          {activeStep === 2 && (
                            <Button
                              disabled={disableButton}
                              className="primary"
                              type="submit"
                            >
                              Salvar Edição
                            </Button>
                          )}
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

export default privateRoute(['administrador'])(AdminCategoriesEdit);

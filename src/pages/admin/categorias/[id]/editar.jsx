import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';
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
import Error from '@/components/Error';
import getFormData from '@/helpers/getFormData';
import errorMessage from '@/helpers/errorMessage';
import CategoriesService from '@/services/CategoriesService';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader/index';
import TextArea from '@/components/TextArea/index';
import Pagination from '@/components/Pagination/index';
import ColorsContainer, { ColorsGrid } from '@/components/ColorsContainer';

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

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        name: null,
        description: null,
        colors: null
      };
    }

    return getFormData(formRef.current, {
      name: null,
      description: null,
      colors: null
    });
  };

  useEffect(() => {
    if (dataCategory) setSelectedColor(dataCategory.colors.id);
  }, [dataCategory]);

  const handleColors = colorId => {
    setSelectedColor(colorId);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setDisableButton(true);
    schema
      .validate(getData())
      .then(async data => {
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
          data.colors = selectedColor;

          await CategoriesService.update(id, data).then(res => {
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
      });
  };

  if (errorColors || errorCategory)
    return <Error error={errorColors || errorCategory} />;

  return (
    <>
      <Head>
        <title>Painel Adminstrativo | Editar Categoria - Agro7</title>
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
                  { route: '/admin', name: 'Painel Adminstrativo' },
                  { route: '/admin/categorias', name: 'Categorias' },
                  {
                    route: `/admin/categorias/${id}/detalhes`,
                    name: `Categoria ${dataCategory?.name}`
                  }
                ]}
              />
              <h2>Editar Categoria {dataCategory && dataCategory.name}</h2>
              <p>Aqui você irá editar a categoria em questão</p>
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
                  {(dataCategory && (
                    <>
                      <MultiStep activeStep={activeStep}>
                        <Step label="Dados" onClick={() => setActiveStep(1)}>
                          <h4 className="step-title">Dados da Categoria</h4>
                          <Input
                            type="text"
                            label="Nome"
                            name="name"
                            initialValue={dataCategory.name}
                          />
                          <TextArea
                            name="description"
                            label="Descrição"
                            initialValue={dataCategory.description}
                          />
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
                              Salvar Categoria
                            </Button>
                          )}
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

export default privateRoute(['administrator'])(AdminCategoriesEdit);

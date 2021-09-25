import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';
import * as yup from 'yup';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import FileInput from '@/components/FileInput';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import TextArea from '@/components/TextArea/index';
import Error from '@/components/Error';

import errorMessage from '@/helpers/errorMessage';
import ProductsService from '@/services/ProductsService';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader/index';
import NutricionalService from '@/services/NutricionalService';
import isEmpty from '@/helpers/isEmpty';
import objectKeyExists from '@/helpers/objectKeyExists';
import ImageContainer from '@/components/ImageContainer/index';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

function AdminProductsEdit() {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const inputNutricionalRef = useRef(null);
  const inputNutricionalVerdeRef = useRef(null);

  const [activeStep, setActiveStep] = useState(1);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();

  const { id } = router.query;
  const { data, error, mutate } = useFetch(`/products/find/by/id/${id}`);

  const [productData, setProductData] = useState({});

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
  }, []);

  useEffect(() => {
    if (data) {
      setProductData({ ...data });

      const nutritional = data?.nutritional;

      if (!isEmpty(nutritional)) {
        const nutritionalTableData = nutritional.find(n => !n.is_green);
        const nutritionalTableGreenData = nutritional.find(n => n.is_green);

        if (!isEmpty(nutritionalTableData))
          setProductData(prevData => ({
            ...prevData,
            nutritional: nutritionalTableData
          }));
        if (!isEmpty(nutritionalTableGreenData))
          setProductData(prevData => ({
            ...prevData,
            green: nutritionalTableGreenData
          }));
      }
    }
  }, [data]);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (d, { reset }, e) => {
    setDisableButton(true);

    ProductsService.schema(true)
      .validate(d)
      .then(async dataEdit => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        if (
          (e.target.file.files.length > 0 && inputRef.current.error.message) ||
          (e.target.fileNutricional.files.length > 0 &&
            inputNutricionalRef.current.error.message) ||
          (e.target.fileNutricionalVerde.files.length > 0 &&
            inputNutricionalVerdeRef.current.error.message)
        ) {
          setAlert({
            type: 'error',
            message:
              inputRef.current.error.message ||
              inputNutricionalRef.current.error.message ||
              inputNutricionalVerdeRef.current.error.message
          });
          setDisableButton(false);
        } else {
          const productFormData = new FormData();

          productFormData.append('name', dataEdit.name);
          productFormData.append('description', dataEdit.description);

          if (e.target.file.files.length > 0)
            productFormData.append('file', e.target.file.files[0]);

          await ProductsService.update(id, productFormData).then(async res => {
            if (res.status !== 200 || res?.statusCode) {
              setAlert({ type: 'error', message: errorMessage(res) });
              setTimeout(() => {
                setDisableButton(false);
              }, 1000);
            } else {
              const nutricionalImageEdit =
                e.target.fileNutricional.files.length > 0;
              let editSuccess = false;

              // Nutricional

              Object.keys(productData?.nutritional).forEach(key => {
                if (objectKeyExists(dataEdit.nutritional, key)) {
                  if (isEmpty(dataEdit.nutritional[key])) {
                    dataEdit.nutritional[key] = '0';
                  } else {
                    dataEdit.nutritional[key] = String(
                      dataEdit?.nutritional[key]
                    );
                  }
                }
              });

              await NutricionalService.update(
                productData?.nutritional.id,
                dataEdit.nutritional
              ).then(async res2 => {
                if (res2.status !== 200 || res2?.statusCode) {
                  setAlert({ type: 'error', message: errorMessage(res2) });
                  setTimeout(() => {
                    setDisableButton(false);
                  }, 1000);
                } else if (nutricionalImageEdit) {
                  const nutricionalImageFormData = new FormData();

                  nutricionalImageFormData.append(
                    'file',
                    e.target.fileNutricional.files[0]
                  );

                  await NutricionalService.updateNutritionalImage(
                    productData?.nutritional?.nutritional_images?.id,
                    nutricionalImageFormData
                  ).then(res3 => {
                    if (res3.status !== 200 || res3?.statusCode) {
                      setAlert({
                        type: 'error',
                        message: errorMessage(res3)
                      });
                      setTimeout(() => {
                        setDisableButton(false);
                      }, 1000);
                    } else {
                      editSuccess = true;
                    }
                  });
                } else {
                  editSuccess = true;
                }
              });

              // Edit Nutritional Green

              const nutricionalGreenImageEdit =
                e.target.fileNutricionalVerde.files.length > 0;

              if (!isEmpty(dataEdit?.green) || nutricionalGreenImageEdit) {
                editSuccess = false;

                Object.keys(productData?.green).forEach(key => {
                  if (objectKeyExists(dataEdit.green, key)) {
                    if (isEmpty(dataEdit.green[key])) {
                      dataEdit.green[key] = '0';
                    } else {
                      dataEdit.green[key] = String(dataEdit?.green[key]);
                    }
                  }
                });

                dataEdit.green = { edit: true };

                await NutricionalService.update(
                  productData?.green.id,
                  dataEdit.green
                ).then(async res2 => {
                  if (res2.status !== 200 || res2?.statusCode) {
                    setAlert({ type: 'error', message: errorMessage(res2) });
                    setTimeout(() => {
                      setDisableButton(false);
                    }, 1000);
                  } else if (nutricionalGreenImageEdit) {
                    const nutricionalVerdeImageFormData = new FormData();

                    nutricionalVerdeImageFormData.append(
                      'file',
                      e.target.fileNutricionalVerde.files[0]
                    );

                    await NutricionalService.updateNutritionalImage(
                      productData?.green?.nutritional_images?.id,
                      nutricionalVerdeImageFormData
                    ).then(res3 => {
                      if (res3.status !== 200 || res3?.statusCode) {
                        setAlert({
                          type: 'error',
                          message: errorMessage(res3)
                        });
                        setTimeout(() => {
                          setDisableButton(false);
                        }, 1000);
                      } else {
                        editSuccess = true;
                      }
                    });
                  } else {
                    editSuccess = true;
                  }
                });
              }

              if (editSuccess) {
                mutate();

                setAlert({
                  type: 'success',
                  message: 'Produto editado com sucesso!'
                });

                setTimeout(() => {
                  router.push(`/admin/produtos/${id}/detalhes`);
                  setDisableButton(false);
                }, 1000);
              }
            }
          });
        }
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors?.[0] });
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
        <title>Painel Administrativo | Editar Produto - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%produto': data?.name
              }}
              title={`Editar Produto ${data?.name}`}
              description="Aqui, você irá editar o produto em questão"
              isLoading={isEmpty(data)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                {(data && !isEmpty(productData) && (
                  <>
                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmit}
                      initialData={{
                        ...productData
                      }}
                    >
                      <MultiStep activeStep={activeStep}>
                        <Step label="Produto" onClick={() => setActiveStep(1)}>
                          <Input
                            type="text"
                            name="name"
                            label="Nome do produto"
                          />
                          <TextArea
                            name="description"
                            label="Descrição do produto"
                          />

                          <FileInput
                            ref={inputRef}
                            name="file"
                            label="Selecione a nova imagem do Produto"
                            extensions={['.jpg', '.jpeg', '.png', '.gif']}
                            max={1}
                            text="Clique aqui para substituir a imagem atual ou apenas arraste-a."
                          />

                          <ImageContainer
                            src={data?.url}
                            alt={`Imagem atual do Produto ${data?.name}`}
                            label={`Imagem atual do Produto ${data?.name}`}
                            zoom
                          />
                        </Step>
                        <Step
                          label="Nutricional"
                          onClick={() => setActiveStep(2)}
                        >
                          <h4 className="step-title">Tabela Nutricional:</h4>

                          <FileInput
                            ref={inputNutricionalRef}
                            name="fileNutricional"
                            label="Selecione a nova imagem da Tabela Nutricional"
                            extensions={['.jpg', '.jpeg', '.png', '.gif']}
                            max={1}
                          />

                          <ImageContainer
                            src={
                              productData?.nutritional?.nutritional_images?.url
                            }
                            alt={`Tabela Nutricional atual do Produto ${data?.name}`}
                            label={`Tabela Nutricional atual do Produto ${data?.name}`}
                            zoom
                          />

                          <h4 className="step-title">
                            Escrever Nutricional (opcional)
                          </h4>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.water"
                                label="Água (%)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.calories"
                                label="Calorias (Kcal)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.protein"
                                label="Proteína (g)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.carbohydrate"
                                label="Carboidrato (g)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.dietary_fiber"
                                label="Fibra Alimentar (g)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.cholesterol"
                                label="Colesterol (mg)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.lipids"
                                label="Lipídios (g)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.saturated_fatty_acid"
                                label="Ácido Graxo Saturado (g)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.unsaturated_fatty_acid"
                                label="Ácido Graxo Mono insaturado (g)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.polyunsaturated_fatty_acid"
                                label="Ácido Graxo Poli insaturado (g)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.calcium"
                                label="Cálcio (mg)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.phosphorus"
                                label="Fósforo (mg)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.iron"
                                label="Ferro (mg)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.potassium"
                                label="Potássio (mg)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.sodium"
                                label="Sódio (mg)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.vitamin_b1"
                                label="Vitamina B1 (mg)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.vitamin_b2"
                                label="Vitamina B2 (mg)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.vitamin_b3"
                                label="Vitamina B3 (mg)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.vitamin_b6"
                                label="Vitamina B6 (mg)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.vitamin_c"
                                label="Vitamina C (mg)"
                              />
                            </div>
                          </div>
                        </Step>

                        <Step
                          label="Nutricional Verde"
                          onClick={() => setActiveStep(3)}
                        >
                          <h4 className="step-title">
                            Tabela Nutricional Verde:
                          </h4>

                          <FileInput
                            ref={inputNutricionalVerdeRef}
                            name="fileNutricionalVerde"
                            label="Selecione a nova imagem da Tabela Nutricional Verde"
                            extensions={['.jpg', '.jpeg', '.png', '.gif']}
                            max={1}
                          />

                          <ImageContainer
                            src={productData?.green?.nutritional_images?.url}
                            alt={`Tabela Nutricional atual do Produto ${data?.name}`}
                            label={`Tabela Nutricional atual do Produto ${data?.name}`}
                            zoom
                          />

                          <h4 className="step-title">
                            Escrever Nutricional (opcional)
                          </h4>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="green.water"
                                label="Água (%)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="green.calories"
                                label="Calorias (Kcal)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="green.protein"
                                label="Proteína (g)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="green.carbohydrate"
                                label="Carboidrato (g)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="green.dietary_fiber"
                                label="Fibra Alimentar (g)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="green.cholesterol"
                                label="Colesterol (mg)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="green.lipids"
                                label="Lipídios (g)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="green.saturated_fatty_acid"
                                label="Ácido Graxo Saturado (g)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="green.unsaturated_fatty_acid"
                                label="Ácido Graxo Mono insaturado (g)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="green.polyunsaturated_fatty_acid"
                                label="Ácido Graxo Poli insaturado (g)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="green.calcium"
                                label="Cálcio (mg)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="green.phosphorus"
                                label="Fósforo (mg)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="green.iron"
                                label="Ferro (mg)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="green.potassium"
                                label="Potássio (mg)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="green.sodium"
                                label="Sódio (mg)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="green.vitamin_b1"
                                label="Vitamina B1 (mg)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="green.vitamin_b2"
                                label="Vitamina B2 (mg)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="green.vitamin_b3"
                                label="Vitamina B3 (mg)"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="green.vitamin_b6"
                                label="Vitamina B6 (mg)"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="green.vitamin_c"
                                label="Vitamina C (mg)"
                              />
                            </div>
                          </div>
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
                            <Button type="button" onClick={handleCancel}>
                              Cancelar
                            </Button>
                          </div>
                        )}
                        <div>
                          {activeStep !== 3 && (
                            <Button
                              type="button"
                              onClick={() => setActiveStep(activeStep + 1)}
                              className="primary"
                            >
                              Continuar
                            </Button>
                          )}

                          {activeStep === 3 && (
                            <Button
                              disabled={disableButton}
                              className="primary"
                              type="submit"
                            >
                              Salvar edição
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

export default privateRoute(['administrador'])(AdminProductsEdit);

import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';
import * as yup from 'yup';
import { Form } from '@unform/web';
import { Scope } from '@unform/core';

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

import errorMessage from '@/helpers/errorMessage';

import ProductsService from '@/services/ProductsService';
import { useRouter } from 'next/router';
import TextArea from '@/components/TextArea/index';
import NutricionalService from '@/services/NutricionalService';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import isEmpty from '@/helpers/isEmpty';
import scrollTo from '@/helpers/scrollTo';

function AdminProductsCreate() {
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const inputRef = useRef(null);
  const inputNutricionalRef = useRef(null);
  const inputNutricionalVerdeRef = useRef(null);

  const [activeStep, setActiveStep] = useState(1);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
  }, []);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (...{ 0: d, 2: e }) => {
    setDisableButton(true);

    ProductsService.schema()
      .validate(d)
      .then(async data => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        scrollTo(alertRef);

        if (
          inputRef.current.error.message ||
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

          productFormData.append('name', data.name);
          productFormData.append('description', data.description);
          productFormData.append('file', e.target.file.files[0]);

          await ProductsService.create(productFormData).then(async res => {
            if (res.status !== 201 || res?.statusCode) {
              setAlert({ type: 'error', message: errorMessage(res) });
              setTimeout(() => {
                setDisableButton(false);
              }, 1000);
            } else {
              let success = false;

              const canAddNutritionalTable =
                e.target.fileNutricional.files.length > 0;
              const productId = res.data.id;

              const nutricionalFormData = new FormData();

              if (canAddNutritionalTable) {
                nutricionalFormData.append(
                  'file',
                  e.target.fileNutricional.files[0]
                );

                Object.keys(data).forEach(key => {
                  if (!['green', 'name', 'description'].includes(key)) {
                    nutricionalFormData.append(key, data[key]);
                  }
                });

                nutricionalFormData.append('products', productId);
                nutricionalFormData.append('is_green', String(0));

                await NutricionalService.create(nutricionalFormData).then(
                  async res2 => {
                    if (res2.status !== 201 || res2?.statusCode) {
                      setAlert({ type: 'error', message: errorMessage(res2) });

                      setTimeout(() => {
                        setDisableButton(false);
                      }, 1000);
                    } else {
                      success = true;
                    }
                  }
                );
              }

              if (
                !isEmpty(data?.green?.length) ||
                e.target.fileNutricionalVerde.files.length > 0
              ) {
                success = false;

                const nutricionalGreenFormData = new FormData();

                nutricionalGreenFormData.append(
                  'file',
                  e.target.fileNutricionalVerde.files[0]
                );

                Object.keys(data.green).forEach(key => {
                  nutricionalGreenFormData.append(key, data.green[key]);
                });

                nutricionalGreenFormData.append('products', productId);
                nutricionalGreenFormData.append('is_green', String(1));

                await NutricionalService.create(nutricionalGreenFormData).then(
                  res3 => {
                    if (res3.status !== 201 || res3?.statusCode) {
                      setAlert({
                        type: 'error',
                        message: errorMessage(res3)
                      });

                      setTimeout(() => {
                        setDisableButton(false);
                      }, 1000);
                    } else {
                      success = true;
                    }
                  }
                );
              }

              if (success) {
                setTimeout(() => {
                  router.push(`/admin/produtos/${productId}/detalhes`);

                  setDisableButton(false);
                }, 1000);
              }
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

  return (
    <>
      <Head>
        <title>Painel Administrativo | Cadastrar Produto - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title="Cadastrar Produtos"
              description="Aqui, você irá cadastrar um produto no sistema"
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
                  <MultiStep activeStep={activeStep}>
                    <Step label="Produto" onClick={() => setActiveStep(1)}>
                      <h4 className="step-title">Dados do Produto</h4>
                      <Input type="text" name="name" label="Nome do produto" />
                      <TextArea
                        name="description"
                        label="Descrição do produto"
                      />
                      <FileInput
                        ref={inputRef}
                        name="file"
                        label="Selecione a Imagem do Produto"
                        extensions={[
                          '.jpg',
                          '.jpeg',
                          '.png',
                          '.gif',
                          '.webp',
                          '.webm'
                        ]}
                        max={1}
                      />
                    </Step>
                    <Step label="Nutricional" onClick={() => setActiveStep(2)}>
                      <h4 className="step-title">Tabela Nutricional:</h4>
                      <FileInput
                        ref={inputNutricionalRef}
                        name="fileNutricional"
                        label="Selecione a Imagem da Tabela Nutricional"
                        extensions={[
                          '.jpg',
                          '.jpeg',
                          '.png',
                          '.gif',
                          '.webp',
                          '.webm'
                        ]}
                        max={1}
                      />
                      <h4 className="step-title">
                        Escrever Nutricional (opcional)
                      </h4>
                      <div className="form-group">
                        <div>
                          <Input type="number" name="water" label="Água (%)" />
                        </div>
                        <div>
                          <Input
                            type="number"
                            name="calories"
                            label="Calorias (Kcal)"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="number"
                            name="protein"
                            label="Proteína (g)"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            name="carbohydrate"
                            label="Carboidrato (g)"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="number"
                            name="dietary_fiber"
                            label="Fibra Alimentar (g)"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            name="cholesterol"
                            label="Colesterol (mg)"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="number"
                            name="lipids"
                            label="Lipídios (g)"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            name="saturated_fatty_acid"
                            label="Ácido Graxo Saturado (g)"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="number"
                            name="unsaturated_fatty_acid"
                            label="Ácido Graxo Mono insaturado (g)"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            name="polyunsaturated_fatty_acid"
                            label="Ácido Graxo Poli insaturado (g)"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="number"
                            name="calcium"
                            label="Cálcio (mg)"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            name="phosphorus"
                            label="Fósforo (mg)"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input type="number" name="iron" label="Ferro (mg)" />
                        </div>
                        <div>
                          <Input
                            type="number"
                            name="potassium"
                            label="Potássio (mg)"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="number"
                            name="sodium"
                            label="Sódio (mg)"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            name="vitamin_b1"
                            label="Vitamina B1 (mg)"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="number"
                            name="vitamin_b2"
                            label="Vitamina B2 (mg)"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            name="vitamin_b3"
                            label="Vitamina B3 (mg)"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="number"
                            name="vitamin_b6"
                            label="Vitamina B6 (mg)"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            name="vitamin_c"
                            label="Vitamina C (mg)"
                          />
                        </div>
                      </div>
                    </Step>
                    <Step
                      label="Nutricional Verde"
                      onClick={() => setActiveStep(3)}
                    >
                      <h4 className="step-title">Tabela Nutricional Verde:</h4>
                      <FileInput
                        ref={inputNutricionalVerdeRef}
                        name="fileNutricionalVerde"
                        label="Selecione a Imagem da Tabela Nutricional Verde (opcional)"
                        extensions={[
                          '.jpg',
                          '.jpeg',
                          '.png',
                          '.gif',
                          '.webp',
                          '.webm'
                        ]}
                        max={1}
                      />
                      <h4 className="step-title">
                        Escrever Nutricional Verde (opcional)
                      </h4>
                      <Scope path="green">
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              name="water"
                              label="Água (%)"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="calories"
                              label="Calorias (Kcal)"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              name="protein"
                              label="Proteína (g)"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="carbohydrate"
                              label="Carboidrato (g)"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              name="dietary_fiber"
                              label="Fibra Alimentar (g)"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="cholesterol"
                              label="Colesterol (mg)"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              name="lipids"
                              label="Lipídios (g)"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="saturated_fatty_acid"
                              label="Ácido Graxo Saturado (g)"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              name="unsaturated_fatty_acid"
                              label="Ácido Graxo Mono insaturado (g)"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="polyunsaturated_fatty_acid"
                              label="Ácido Graxo Poli insaturado (g)"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              name="calcium"
                              label="Cálcio (mg)"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="phosphorus"
                              label="Fósforo (mg)"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              name="iron"
                              label="Ferro (mg)"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="potassium"
                              label="Potássio (mg)"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              name="sodium"
                              label="Sódio (mg)"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="vitamin_b1"
                              label="Vitamina B1 (mg)"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              name="vitamin_b2"
                              label="Vitamina B2 (mg)"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="vitamin_b3"
                              label="Vitamina B3 (mg)"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              name="vitamin_b6"
                              label="Vitamina B6 (mg)"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="vitamin_c"
                              label="Vitamina C (mg)"
                            />
                          </div>
                        </div>
                      </Scope>
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
                          Cadastrar produto
                        </Button>
                      )}
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

export default privateRoute(['administrador'])(AdminProductsCreate);

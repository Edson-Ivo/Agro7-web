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
import ImageContainer from '@/components/ImageContainer/index';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

const schema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório!'),
  description: yup.string().nullable(),
  water: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Água (%) deve ser um valor positivo')
    .nullable(),
  calories: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Calorias (Kcal) deve ser um valor positivo')
    .nullable(),
  protein: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Proteína (g) deve ser um valor positivo')
    .nullable(),
  carbohydrate: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Carboidrato (g) deve ser um valor positivo')
    .nullable(),
  dietary_fiber: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Fibra Alimentar (g) deve ser um valor positivo')
    .nullable(),
  cholesterol: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Colesterol (mg) deve ser um valor positivo')
    .nullable(),
  lipids: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Lipídios (g) deve ser um valor positivo')
    .nullable(),
  saturated_fatty_acid: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Ácido Graxo Saturado (g) deve ser um valor positivo')
    .nullable(),
  unsaturated_fatty_acid: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive(
      'O campo Ácido Graxo Mono insaturado (g) deve ser um valor positivo'
    )
    .nullable(),
  polyunsaturated_fatty_acid: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive(
      'O campo Ácido Graxo Poli insaturado (g) deve ser um valor positivo'
    )
    .nullable(),
  calcium: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Cálcio (mg) deve ser um valor positivo')
    .nullable(),
  phosphorus: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Fósforo (mg) deve ser um valor positivo')
    .nullable(),
  iron: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Ferro (mg) deve ser um valor positivo')
    .nullable(),
  potassium: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Potássio (mg) deve ser um valor positivo')
    .nullable(),
  sodium: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Sódio (mg) deve ser um valor positivo')
    .nullable(),
  vitamin_b1: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Vitamina B1 (mg) deve ser um valor positivo')
    .nullable(),
  vitamin_b2: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Vitamina B2 (mg) deve ser um valor positivo')
    .nullable(),
  vitamin_b3: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Vitamina B3 (mg) deve ser um valor positivo')
    .nullable(),
  vitamin_b6: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Vitamina B6 (mg) deve ser um valor positivo')
    .nullable(),
  vitamin_c: yup
    .number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .positive('O campo Vitamina C (mg) deve ser um valor positivo')
    .nullable()
});

function AdminProductsEdit() {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const inputNutricionalRef = useRef(null);
  const [activeStep, setActiveStep] = useState(1);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();

  const { id } = router.query;
  const { data, error, mutate } = useFetch(`/products/find/by/id/${id}`);

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
  }, []);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (d, { reset }, e) => {
    setDisableButton(true);

    schema
      .validate(d)
      .then(async dataEdit => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        if (
          (e.target.file.files.length > 0 && inputRef.current.error.message) ||
          (e.target.fileNutricional.files.length > 0 &&
            inputNutricionalRef.current.error.message)
        ) {
          setAlert({
            type: 'error',
            message:
              inputRef.current.error.message ||
              inputNutricionalRef.current.error.message
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

              Object.keys(dataEdit?.nutritional).forEach(key => {
                if (isEmpty(dataEdit.nutritional[key]))
                  delete dataEdit.nutritional[key];
                else
                  dataEdit.nutritional[key] = String(
                    dataEdit?.nutritional[key]
                  );
              });

              await NutricionalService.update(
                data?.nutritional.id,
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
                    data?.nutritional?.nutritional_images?.id,
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
              breadcrumb={[
                { route: '/', name: 'Home' },
                { route: '/admin', name: 'Painel Administrativo' },
                { route: '/admin/produtos', name: 'Produtos' },
                {
                  route: `/admin/produtos/${id}/editar`,
                  name: 'Editar'
                }
              ]}
              title={`Editar Produto ${data?.name}`}
              description="Aqui você irá editar o produto em questão"
              isLoading={isEmpty(data)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                {(data && (
                  <>
                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmit}
                      initialData={{
                        ...data
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
                            src={data?.nutritional?.nutritional_images?.url}
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
                              Editar produto
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

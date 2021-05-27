import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';
import * as yup from 'yup';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import FileInput from '@/components/FileInput';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import TextArea from '@/components/TextArea/index';
import Error from '@/components/Error';

import getFormData from '@/helpers/getFormData';
import errorMessage from '@/helpers/errorMessage';
import ProductsService from '@/services/ProductsService';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader/index';

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
  const [activeStep, setActiveStep] = useState(1);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();

  const { id } = router.query;
  const { data, error, mutate } = useFetch(`/products/find/by/id/${id}`);

  useEffect(
    () => () => {
      setAlert({ type: '', message: '' });
      setDisableButton(false);
    },
    []
  );

  const getData = () => {
    if (formRef.current === undefined) {
      return {
        name: null,
        description: null,
        water: null,
        calories: null,
        protein: null,
        carbohydrate: null,
        dietary_fiber: null,
        cholesterol: null,
        lipids: null,
        saturated_fatty_acid: null,
        unsaturated_fatty_acid: null,
        polyunsaturated_fatty_acid: null,
        calcium: null,
        phosphorus: null,
        iron: null,
        potassium: null,
        sodium: null,
        vitamin_b1: null,
        vitamin_b2: null,
        vitamin_b3: null,
        vitamin_b6: null,
        vitamin_c: null
      };
    }

    return getFormData(formRef.current, {
      name: null,
      description: null,
      water: null,
      calories: null,
      protein: null,
      carbohydrate: null,
      dietary_fiber: null,
      cholesterol: null,
      lipids: null,
      saturated_fatty_acid: null,
      unsaturated_fatty_acid: null,
      polyunsaturated_fatty_acid: null,
      calcium: null,
      phosphorus: null,
      iron: null,
      potassium: null,
      sodium: null,
      vitamin_b1: null,
      vitamin_b2: null,
      vitamin_b3: null,
      vitamin_b6: null,
      vitamin_c: null
    });
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setDisableButton(true);

    schema
      .validate(getData())
      .then(async dataEdit => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        if (e.target.file.files.length > 0 && inputRef.current.error.message) {
          setAlert({ type: 'error', message: inputRef.current.error.message });
          setDisableButton(false);
        } else {
          const formData = new FormData();

          setAlert({
            type: 'success',
            message: 'Enviando...'
          });

          formData.append('name', dataEdit.name);
          formData.append('description', dataEdit.description);

          if (e.target.file.files.length > 0) {
            formData.append('file', e.target.file.files[0]);
          }

          await ProductsService.update(id, formData).then(async res => {
            if (res.status !== 200 || res?.statusCode) {
              setAlert({ type: 'error', message: errorMessage(res) });
              setTimeout(() => {
                setDisableButton(false);
              }, 1000);
            } else {
              await ProductsService.updateNutritional(
                data?.nutritional.id,
                dataEdit
              ).then(res2 => {
                if (res2.status !== 200 || res2?.statusCode) {
                  setAlert({ type: 'error', message: errorMessage(res2) });
                  setTimeout(() => {
                    setDisableButton(false);
                  }, 1000);
                } else {
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
              });
            }
          });
        }
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
        setDisableButton(false);
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
            <div className="SectionHeader__content">
              <Breadcrumb
                path={[
                  { route: '/', name: 'Home' },
                  { route: '/admin', name: 'Painel Administrativo' },
                  { route: '/admin/produtos', name: 'Produtos' },
                  {
                    route: `/admin/produtos/${id}/editar`,
                    name: 'Editar'
                  }
                ]}
              />
              <h2>Editar Produto {`(${data && data.name})`}</h2>
              <p>Aqui você irá editar o produto em questão</p>
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
                  {(data && (
                    <>
                      <MultiStep activeStep={activeStep}>
                        <Step label="Produto" onClick={() => setActiveStep(1)}>
                          <Input
                            type="text"
                            name="name"
                            label="Nome do produto"
                            initialValue={data.name}
                          />
                          <TextArea
                            name="description"
                            label="Descrição do produto"
                            initialValue={data.description}
                          />
                          <Input
                            type="text"
                            name="image"
                            label="Imagem atual"
                            initialValue={data.url}
                            disabled
                          />
                          <FileInput
                            ref={inputRef}
                            name="file"
                            label="Selecione a Imagem do Produto"
                            extensions={['.jpg', '.jpeg', '.png', '.gif']}
                            max={1}
                            text="Clique aqui para substituir a imagem atual ou apenas arraste-a."
                          />
                        </Step>
                        <Step
                          label="Nutricional"
                          onClick={() => setActiveStep(2)}
                        >
                          <h4 className="step-title">Nutricional</h4>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="water"
                                label="Água (%)"
                                initialValue={data?.nutritional.water || ''}
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="calories"
                                label="Calorias (Kcal)"
                                initialValue={data?.nutritional.calories || ''}
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="protein"
                                label="Proteína (g)"
                                initialValue={data?.nutritional.protein || ''}
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="carbohydrate"
                                label="Carboidrato (g)"
                                initialValue={
                                  data?.nutritional.carbohydrate || ''
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="dietary_fiber"
                                label="Fibra Alimentar (g)"
                                initialValue={
                                  data?.nutritional.dietary_fiber || ''
                                }
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="cholesterol"
                                label="Colesterol (mg)"
                                initialValue={
                                  data?.nutritional.cholesterol || ''
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="lipids"
                                label="Lipídios (g)"
                                initialValue={data?.nutritional.lipids || ''}
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="saturated_fatty_acid"
                                label="Ácido Graxo Saturado (g)"
                                initialValue={
                                  data?.nutritional.saturated_fatty_acid || ''
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="unsaturated_fatty_acid"
                                label="Ácido Graxo Mono insaturado (g)"
                                initialValue={
                                  data?.nutritional.unsaturated_fatty_acid || ''
                                }
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="polyunsaturated_fatty_acid"
                                label="Ácido Graxo Poli insaturado (g)"
                                initialValue={
                                  data?.nutritional
                                    .polyunsaturated_fatty_acid || ''
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="calcium"
                                label="Cálcio (mg)"
                                initialValue={data?.nutritional.calcium || ''}
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="phosphorus"
                                label="Fósforo (mg)"
                                initialValue={
                                  data?.nutritional.phosphorus || ''
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="iron"
                                label="Ferro (mg)"
                                initialValue={data?.nutritional.iron || ''}
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="potassium"
                                label="Potássio (mg)"
                                initialValue={data?.nutritional.potassium || ''}
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="sodium"
                                label="Sódio (mg)"
                                initialValue={data?.nutritional.sodium || ''}
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="vitamin_b1"
                                label="Vitamina B1 (mg)"
                                initialValue={
                                  data?.nutritional.vitamin_b1 || ''
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="vitamin_b2"
                                label="Vitamina B2 (mg)"
                                initialValue={
                                  data?.nutritional.vitamin_b2 || ''
                                }
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="vitamin_b3"
                                label="Vitamina B3 (mg)"
                                initialValue={
                                  data?.nutritional.vitamin_b3 || ''
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="vitamin_b6"
                                label="Vitamina B6 (mg)"
                                initialValue={
                                  data?.nutritional.vitamin_b6 || ''
                                }
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="vitamin_c"
                                label="Vitamina C (mg)"
                                initialValue={data?.nutritional.vitamin_c || ''}
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

export default privateRoute(['administrator'])(AdminProductsEdit);

import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
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

import errorMessage from '@/helpers/errorMessage';
import getFormData from '@/helpers/getFormData';

import ProductsService from '@/services/ProductsService';
import { useRouter } from 'next/router';
import TextArea from '@/components/TextArea/index';

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

function AdminProductsCreate() {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const [activeStep, setActiveStep] = useState(1);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();

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
      .then(async data => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        if (inputRef.current.error.message) {
          setAlert({ type: 'error', message: inputRef.current.error.message });
          setDisableButton(false);
        } else {
          const formData = new FormData();

          setAlert({
            type: 'success',
            message: 'Enviando...'
          });

          Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
          });

          formData.append('file', e.target.file.files[0]);

          await ProductsService.create(formData).then(res => {
            if (res.status !== 201 || res?.statusCode) {
              setAlert({ type: 'error', message: errorMessage(res) });
              setTimeout(() => {
                setDisableButton(false);
              }, 1000);
            } else {
              setAlert({
                type: 'success',
                message: 'Produto cadastrado com sucesso!'
              });

              setTimeout(() => {
                router.push(`/admin/produtos/${res.data.id}/detalhes`);
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

  return (
    <>
      <Head>
        <title>Painel Adminstrativo | Cadastrar Produto - Agro7</title>
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
                  { route: '/admin/produtos', name: 'Produtos' },
                  {
                    route: '/admin/produtos/cadastrar',
                    name: 'Cadastrar'
                  }
                ]}
              />
              <h2>Cadastrar Produtos</h2>
              <p>Aqui você irá cadastrar um produto no sistema</p>
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
                        extensions={['.jpg', '.jpeg', '.png', '.gif']}
                        max={1}
                      />
                    </Step>
                    <Step label="Nutricional" onClick={() => setActiveStep(2)}>
                      <h4 className="step-title">Nutricional (opcional)</h4>
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
                          Cadastrar produto
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute(['administrator'])(AdminProductsCreate);

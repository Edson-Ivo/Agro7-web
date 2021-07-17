import React, { useRef, useState } from 'react';
import Head from 'next/head';

import { useRouter } from 'next/router';
import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';

import TextArea from '@/components/TextArea/index';
import Error from '@/components/Error';

import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader/index';
import ImageContainer from '@/components/ImageContainer/index';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import isEmpty from '@/helpers/isEmpty';

function AdminProductsDetails() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const formRef = useRef(null);

  const { id } = router.query;
  const { data, error } = useFetch(`/products/find/by/id/${id}`);

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>
          Painel Administrativo | Produto {data && data.name} - Agro7
        </title>
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
              title={`Informações do Produto ${data?.name}`}
              description="Aqui você irá ver informações do produto em questão"
              isLoading={isEmpty(data)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && (
                  <>
                    <Form
                      ref={formRef}
                      initialData={{
                        ...data
                      }}
                    >
                      <MultiStep activeStep={activeStep} onlyView>
                        <Step label="Produto" onClick={() => setActiveStep(1)}>
                          <h4 className="step-title">Informações do Produto</h4>
                          <Input
                            type="text"
                            name="name"
                            label="Nome do produto"
                            disabled
                          />

                          <TextArea
                            name="description"
                            label="Descrição do produto"
                            disabled
                          />

                          <ImageContainer
                            src={data?.url}
                            alt={`Imagem do Produto ${data?.name}`}
                            label={`Imagem do Produto ${data?.name}`}
                            zoom
                          />
                        </Step>
                        <Step
                          label="Nutricional"
                          onClick={() => setActiveStep(2)}
                        >
                          <h4 className="step-title">Tabela Nutricional:</h4>

                          <ImageContainer
                            src={data?.nutritional?.nutritional_images?.url}
                            alt={`Tabela Nutricional do Produto ${data?.name}`}
                            zoom
                          />

                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.water"
                                label="Água (%)"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.calories"
                                label="Calorias (Kcal)"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.protein"
                                label="Proteína (g)"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.carbohydrate"
                                label="Carboidrato (g)"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.dietary_fiber"
                                label="Fibra Alimentar (g)"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.cholesterol"
                                label="Colesterol (mg)"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.lipids"
                                label="Lipídios (g)"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.saturated_fatty_acid"
                                label="Ácido Graxo Saturado (g)"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.unsaturated_fatty_acid"
                                label="Ácido Graxo Mono insaturado (g)"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.polyunsaturated_fatty_acid"
                                label="Ácido Graxo Poli insaturado (g)"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.calcium"
                                label="Cálcio (mg)"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.phosphorus"
                                label="Fósforo (mg)"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.iron"
                                label="Ferro (mg)"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.potassium"
                                label="Potássio (mg)"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.sodium"
                                label="Sódio (mg)"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.vitamin_b1"
                                label="Vitamina B1 (mg)"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.vitamin_b2"
                                label="Vitamina B2 (mg)"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.vitamin_b3"
                                label="Vitamina B3 (mg)"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                name="nutritional.vitamin_b6"
                                label="Vitamina B6 (mg)"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                name="nutritional.vitamin_c"
                                label="Vitamina C (mg)"
                                disabled
                              />
                            </div>
                          </div>
                        </Step>
                      </MultiStep>
                      <div className="form-group buttons">
                        <div>
                          <Button type="button" onClick={() => router.back()}>
                            Voltar
                          </Button>
                        </div>
                        <div>
                          <Button
                            type="button"
                            className="primary"
                            onClick={() =>
                              router.push(`/admin/produtos/${id}/editar`)
                            }
                          >
                            Editar
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

export default privateRoute(['administrador'])(AdminProductsDetails);

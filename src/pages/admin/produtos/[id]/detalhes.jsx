import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';

import TextArea from '@/components/TextArea/index';
import Error from '@/components/Error';

import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader/index';

function AdminProductsDetails() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);

  const { id } = router.query;
  const { data, error } = useFetch(`/products/find/by/id/${id}`);

  return (
    <>
      {error && router.back()}
      <Head>
        <title>
          Painel Adminstrativo | Produto {data && data.name} - Agro7
        </title>
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
                    { route: '/admin', name: 'Painel Adminstrativo' },
                    { route: '/admin/produtos', name: 'Produtos' },
                    {
                      route: `/admin/produtos/${id}/detalhes`,
                      name: `${data?.name}`
                    }
                  ]}
                />
              )}
              <h2>Informações do Produto {data && `(${data.name})`}</h2>
              <p>Aqui você irá ver informações do produto em questão</p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && (
                  <>
                    <MultiStep activeStep={activeStep}>
                      <Step label="Produto" onClick={() => setActiveStep(1)}>
                        <h4 className="step-title">Informações do Produto</h4>
                        <Input
                          type="text"
                          name="name"
                          label="Nome do produto"
                          initialValue={data.name}
                          disabled
                        />
                        <TextArea
                          name="description"
                          label="Descrição do produto"
                          initialValue={data.description}
                          disabled
                        />
                        <Input
                          type="text"
                          name="image"
                          label="Imagem atual"
                          initialValue={data.url}
                          disabled
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
                              disabled
                              initialValue={data?.nutritional.water || ''}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="calories"
                              label="Calorias (Kcal)"
                              disabled
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
                              disabled
                              initialValue={data?.nutritional.protein || ''}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="carbohydrate"
                              label="Carboidrato (g)"
                              disabled
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
                              disabled
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
                              disabled
                              initialValue={data?.nutritional.cholesterol || ''}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              name="lipids"
                              label="Lipídios (g)"
                              disabled
                              initialValue={data?.nutritional.lipids || ''}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="saturated_fatty_acid"
                              label="Ácido Graxo Saturado (g)"
                              disabled
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
                              disabled
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
                              disabled
                              initialValue={
                                data?.nutritional.polyunsaturated_fatty_acid ||
                                ''
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
                              disabled
                              initialValue={data?.nutritional.calcium || ''}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="phosphorus"
                              label="Fósforo (mg)"
                              disabled
                              initialValue={data?.nutritional.phosphorus || ''}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              name="iron"
                              label="Ferro (mg)"
                              disabled
                              initialValue={data?.nutritional.iron || ''}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="potassium"
                              label="Potássio (mg)"
                              disabled
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
                              disabled
                              initialValue={data?.nutritional.sodium || ''}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="vitamin_b1"
                              label="Vitamina B1 (mg)"
                              disabled
                              initialValue={data?.nutritional.vitamin_b1 || ''}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              name="vitamin_b2"
                              label="Vitamina B2 (mg)"
                              disabled
                              initialValue={data?.nutritional.vitamin_b2 || ''}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="vitamin_b3"
                              label="Vitamina B3 (mg)"
                              disabled
                              initialValue={data?.nutritional.vitamin_b3 || ''}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              name="vitamin_b6"
                              label="Vitamina B6 (mg)"
                              disabled
                              initialValue={data?.nutritional.vitamin_b6 || ''}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              name="vitamin_c"
                              label="Vitamina C (mg)"
                              disabled
                              initialValue={data?.nutritional.vitamin_c || ''}
                            />
                          </div>
                        </div>
                      </Step>
                    </MultiStep>
                    <div className="form-group buttons">
                      <div>
                        <Button onClick={() => router.back()}>Voltar</Button>
                      </div>
                      <div>
                        <Button
                          className="primary"
                          onClick={() =>
                            router.push(`/admin/produtos/${id}/editar`)
                          }
                        >
                          Editar
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

export default privateRoute(['administrator'])(AdminProductsDetails);

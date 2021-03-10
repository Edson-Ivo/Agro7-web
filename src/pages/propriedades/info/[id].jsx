import React, { useState } from 'react';
import Head from 'next/head';
import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { useFetch } from '@/hooks/useFetch';
import { privateRoute } from '@/components/PrivateRoute';
import { useRouter } from 'next/router';

function PropertieInfo() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  const [activeStep, setActiveStep] = useState(1);

  return (
    <>
      {error && router.back()}
      <Head>
        <title>Propriedade - Agro7</title>
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
                  { route: '/properties', name: 'Propriedades' }
                ]}
              />
              <h2>Informações da propriedade {data && `(${data.name})`}</h2>
              <p>
                Aqui você irá ver informações detalhadas da propriedade em
                questão
              </p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {data && (
                  <MultiStep activeStep={activeStep}>
                    <Step label="Dados" onClick={() => setActiveStep(1)}>
                      <h4 className="step-title">Dados da Propriedade</h4>

                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="Nome da propriedade"
                            name="name"
                            initialValue={data.name}
                            disabled
                          />
                        </div>
                        <div>
                          <Select
                            options={[
                              { value: 'proprietario', label: 'Proprietário' }
                            ]}
                            label="Quem é você para esta propriedade?"
                            value={data.type_owner}
                            name="type_owner"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="number"
                            label="Área"
                            name="area"
                            initialValue={data.area}
                            disabled
                          />
                        </div>
                        <div>
                          <Select
                            options={[{ value: 'm', label: 'Metros' }]}
                            label="Unidade de medida"
                            value={data.type_dimension}
                            name="type_dimension"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="Estado"
                            name="state"
                            initialValue={data.addresses.state}
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Cidade"
                            name="city"
                            initialValue={data.addresses.city}
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="CEP"
                            name="postcode"
                            initialValue={data.addresses.postcode}
                            mask="cep"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="Bairro"
                            name="neighborhood"
                            initialValue={data.addresses.neighborhood}
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Rua"
                            name="street"
                            initialValue={data.addresses.street}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="Número"
                            name="number"
                            initialValue={data.addresses.number}
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Complementos"
                            name="complements"
                            initialValue={data.addresses.complements || ''}
                            disabled
                          />
                        </div>
                      </div>
                    </Step>
                    <Step
                      label="Localização no mapa"
                      onClick={() => setActiveStep(2)}
                    >
                      <h4 className="step-title">Selecionar Propriedade</h4>

                      <div className="form-group">
                        <div>
                          <Input
                            type="number"
                            label="Latitude"
                            name="latitude"
                            initialValue={data.coordinates.latitude}
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            label="Longitude"
                            name="longitude"
                            initialValue={data.coordinates.longitude}
                          />
                        </div>
                      </div>
                    </Step>
                  </MultiStep>
                )}
                <div className="form-group buttons">
                  <div>
                    <Button onClick={() => router.push('/propriedades')}>
                      Voltar
                    </Button>
                  </div>
                  <div>
                    <Button
                      className="primary"
                      onClick={() => router.push(`/propriedades/edit/${id}`)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(PropertieInfo);

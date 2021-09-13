import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Form } from '@unform/web';
import { useRouter } from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faQrcode } from '@fortawesome/free-solid-svg-icons';

import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import { MapActionGetLatLng } from '@/components/MapApp';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import { useFetch } from '@/hooks/useFetch';
import Error from '@/components/Error/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import TextArea from '@/components/TextArea/index';

import { dateConversor } from '@/helpers/date';
import Loader from '@/components/Loader/index';
import useRewriteRoute from '@/hooks/useRewriteRoute';
import maskString from '@/helpers/maskString';

function VendasDetalhes() {
  const formRef = useRef(null);
  const router = useRouter();

  const { path: routePath } = useRewriteRoute(router);

  const [alert, setAlert] = useState({ type: '', message: '' });
  const [activeStep, setActiveStep] = useState(1);

  const { id } = router.query;

  const { data, error } = useFetch(`/sales/find/by/id/${id}`);

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setActiveStep(1);
  }, []);

  const handleChangeActiveStep = step => {
    setActiveStep(step);
  };

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>Detalhes da Venda {data && data?.batch} - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%lote': data?.batch
              }}
              title={`Venda de ${data?.harvests_sales?.[0]?.harvests?.cultures?.products?.name} - ${data?.total_quantity}${data?.type_unity} (R$ ${data?.value})`}
              description={`Aqui você irá ver os dados da venda no lote ${
                data?.batch
              } de ${
                data?.harvests_sales?.[0]?.harvests?.cultures?.products?.name
              } - ${data?.total_quantity}${data?.type_unity} (R$ ${
                data?.value
              }) em ${dateConversor(
                data?.created_at,
                false
              )} com código de rastreio ${data?.code}.`}
              isLoading={isEmpty(data)}
            >
              <div className="buttons__container">
                <Link href={`${routePath}/${id}/etiquetas/`}>
                  <Button className="primary" style={{ marginRight: 8 }}>
                    <FontAwesomeIcon icon={faTags} /> Etiquetas
                  </Button>
                </Link>
                <Link href={`/rastreamento/${data?.code}`} replace passHref>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ minWidth: 200 }}
                  >
                    <Button className="primary">
                      <FontAwesomeIcon icon={faQrcode} /> Rastreio
                    </Button>
                  </a>
                </Link>
              </div>
            </SectionHeaderContent>
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
                      initialData={{
                        ...data,
                        properties:
                          data?.harvests_sales?.[0]?.harvests?.cultures?.fields
                            ?.properties?.id,
                        products:
                          data?.harvests_sales?.[0]?.harvests?.cultures
                            ?.products?.id,
                        is_green: String(
                          data?.harvests_sales?.[0]?.harvests?.is_green
                        ),
                        transporters_name:
                          data?.vehicles_sales?.vehicles?.transporters?.name,
                        transporters_document:
                          maskString(
                            data?.vehicles_sales?.vehicles?.transporters
                              ?.document,
                            'document'
                          ) || '',
                        transporters_phone:
                          maskString(
                            data?.vehicles_sales?.vehicles?.transporters?.phone,
                            'document'
                          ) || '',
                        transporters_vehicles_name:
                          data?.vehicles_sales?.vehicles?.name,
                        transporters_vehicles_plate:
                          data?.vehicles_sales?.vehicles?.plate,
                        transporters_vehicles_description:
                          data?.vehicles_sales?.vehicles?.description,
                        distributors_document:
                          maskString(
                            data?.distributors?.document,
                            'document'
                          ) || '',
                        distributors_addresses_postcode:
                          maskString(
                            data?.distributors?.addresses?.postcode,
                            'postcode'
                          ) || '',
                        distributors_area: maskString(
                          data?.distributors?.area,
                          'area'
                        )
                      }}
                    >
                      <MultiStep activeStep={activeStep} onlyView>
                        <Step
                          label="Produto"
                          onClick={() => handleChangeActiveStep(1)}
                        >
                          <Select
                            name="properties"
                            options={[
                              {
                                value:
                                  data?.harvests_sales?.[0]?.harvests?.cultures
                                    ?.fields?.properties?.id,
                                label:
                                  data?.harvests_sales?.[0]?.harvests?.cultures
                                    ?.fields?.properties?.name
                              }
                            ]}
                            label="Propriedade:"
                            disabled
                          />

                          <Select
                            options={[
                              {
                                value:
                                  data?.harvests_sales?.[0]?.harvests?.cultures
                                    ?.products?.id,
                                label:
                                  data?.harvests_sales?.[0]?.harvests?.cultures
                                    ?.products?.name
                              }
                            ]}
                            label="Produto:"
                            name="products"
                            disabled
                          />

                          <div className="form-group">
                            <div>
                              <Select
                                options={[
                                  {
                                    value: data?.type_unity,
                                    label: data?.type_unity
                                  }
                                ]}
                                label="Unidade de medida"
                                name="type_unity"
                                disabled
                              />
                            </div>

                            <div>
                              <Select
                                options={[
                                  {
                                    value: 'true',
                                    label: 'Sim'
                                  },
                                  {
                                    value: 'false',
                                    label: 'Não'
                                  }
                                ]}
                                label="O produto está verde?"
                                name="is_green"
                                disabled
                              />
                            </div>
                          </div>
                        </Step>
                        <Step
                          label="Venda"
                          onClick={() => handleChangeActiveStep(2)}
                        >
                          <Input
                            type="number"
                            label="Quantidade da venda"
                            name="total_quantity"
                            disabled
                          />
                          <Input
                            type="text"
                            label="Preço em R$ da venda"
                            name="value"
                            inputMode="numeric"
                            mask="money"
                            disabled
                          />
                        </Step>
                        <Step
                          label="Distribuição"
                          onClick={() => handleChangeActiveStep(3)}
                        >
                          <Input
                            type="text"
                            label="Nome"
                            name="distributors.name"
                            disabled
                          />
                          <Input
                            type="text"
                            label="Documento (CPF ou CNPJ)"
                            name="distributors_document"
                            mask="cpf_cnpj"
                            maxLength="18"
                            disabled
                          />
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                label="Área"
                                name="distributors_area"
                                disabled
                              />
                            </div>
                            <div>
                              <Select
                                options={[
                                  {
                                    value: data?.distributors?.type_dimension,
                                    label: data?.distributors?.type_dimension
                                  }
                                ]}
                                label="Unidade de medida"
                                name="distributors.type_dimension"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="text"
                                label="CEP"
                                name="distributors_addresses_postcode"
                                mask="cep"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="text"
                                label="Estado"
                                name="distributors.addresses.state"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="text"
                                label="Cidade"
                                name="distributors.addresses.city"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="text"
                                label="Bairro"
                                name="distributors.addresses.neighborhood"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="text"
                                label="Rua"
                                name="distributors.addresses.street"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="text"
                                label="Número"
                                name="distributors.addresses.number"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div>
                              <Input
                                type="number"
                                label="Latitude"
                                name="distributors.coordinates.latitude"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                label="Longitude"
                                name="distributors.coordinates.longitude"
                                disabled
                              />
                            </div>
                          </div>

                          <div style={{ marginBottom: '20px' }}>
                            <MapActionGetLatLng
                              positions={[
                                data?.distributors?.coordinates?.latitude,
                                data?.distributors?.coordinates?.longitude
                              ]}
                            />
                          </div>
                        </Step>
                        <Step
                          label="Transporte"
                          onClick={() => handleChangeActiveStep(4)}
                        >
                          <Input
                            type="text"
                            label="Nome"
                            name="transporters_name"
                            disabled
                          />
                          <Input
                            type="text"
                            label="Documento (CPF ou CNPJ)"
                            name="transporters_document"
                            mask="cpf_cnpj"
                            maxLength="18"
                            disabled
                          />
                          <Input
                            type="text"
                            label="Número Telefone"
                            name="transporters_phone"
                            mask="phone"
                            maxLength={15}
                            disabled
                          />
                          <div className="form-group">
                            <div>
                              <Input
                                type="text"
                                label="Nome do veículo"
                                name="transporters_vehicles_name"
                                disabled
                              />
                            </div>
                            <div>
                              <Input
                                type="text"
                                label="Placa do veículo"
                                name="transporters_vehicles_plate"
                                disabled
                              />
                            </div>
                          </div>
                          <TextArea
                            name="transporters_vehicles_description"
                            label="Descrição do veículo"
                            disabled
                          />
                          <div className="form-group buttons">
                            <div>
                              <Button
                                type="button"
                                className="primary"
                                onClick={() =>
                                  router.push(
                                    `${routePath}/transportadoras/${data?.vehicles_sales?.vehicles?.transporters?.id}/detalhes`
                                  )
                                }
                              >
                                Ver Documentos
                              </Button>
                            </div>
                          </div>
                        </Step>
                      </MultiStep>
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

export default privateRoute()(VendasDetalhes);

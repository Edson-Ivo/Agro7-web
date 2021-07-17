import React, { useRef, useState } from 'react';
import Head from 'next/head';
import { Form } from '@unform/web';
import { useRouter } from 'next/router';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import { MapActionGetLatLng } from '@/components/MapApp';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import { useFetch } from '@/hooks/useFetch';
import Error from '@/components/Error/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

import { dateConversor } from '@/helpers/date';

function VendasDistribuidorasDetalhes() {
  const formRef = useRef(null);
  const router = useRouter();

  const [alert] = useState({ type: '', message: '' });

  const { id } = router.query;

  const { data, error } = useFetch(`/distributors/find/by/id/${id}`);

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>Detalhes da Distribuidora {data && data?.name} - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%distribuidora': data?.name
              }}
              title={`Distribuidora ${data?.name}`}
              description={`Aqui você irá ver os dados da sua distribuidora ${
                data?.name
              } cadastrada no dia ${dateConversor(data?.created_at, false)}.`}
              isLoading={isEmpty(data)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                {data && (
                  <>
                    <Form
                      ref={formRef}
                      initialData={{
                        ...data
                      }}
                    >
                      <Input type="text" label="Nome" name="name" disabled />
                      <Input
                        type="text"
                        label="Documento (CPF ou CNPJ)"
                        name="document"
                        mask="cpf_cnpj"
                        maxLength="18"
                        disabled
                      />
                      <div className="form-group">
                        <div>
                          <Input
                            type="number"
                            label="Área"
                            name="area"
                            disabled
                          />
                        </div>
                        <div>
                          <Select
                            options={[
                              {
                                value: data?.type_dimension,
                                label: data?.type_dimension
                              }
                            ]}
                            label="Unidade de medida"
                            name="type_dimension"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="CEP"
                            name="addresses.postcode"
                            mask="cep"
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Estado"
                            name="addresses.state"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="Cidade"
                            name="addresses.city"
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Bairro"
                            name="addresses.neighborhood"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="Rua"
                            name="addresses.street"
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Número"
                            name="addresses.number"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="number"
                            label="Latitude"
                            name="coordinates.latitude"
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            label="Longitude"
                            name="coordinates.longitude"
                            disabled
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <MapActionGetLatLng
                          positions={[
                            data?.coordinates?.latitude,
                            data?.coordinates?.longitude
                          ]}
                        />
                      </div>
                    </Form>
                  </>
                )}
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(VendasDistribuidorasDetalhes);

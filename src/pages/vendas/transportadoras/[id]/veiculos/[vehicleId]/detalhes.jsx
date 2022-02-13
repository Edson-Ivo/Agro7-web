import React, { useRef, useState } from 'react';
import Head from 'next/head';
import { Form } from '@unform/web';
import { useRouter } from 'next/router';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Input from '@/components/Input';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import { useFetch } from '@/hooks/useFetch';
import Error from '@/components/Error/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

import { dateConversor } from '@/helpers/date';
import TextArea from '@/components/TextArea/index';

function VendasTransportadorasVeiculosDetalhes() {
  const formRef = useRef(null);
  const router = useRouter();

  const [alert] = useState({ type: '', message: '' });

  const { vehicleId } = router.query;

  const { data, error } = useFetch(
    `/transporters-vehicles/find/by/id/${vehicleId}`
  );

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>Detalhes do Veículo {data && data?.name} - Agro9</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%transportadora': data?.transporters?.name,
                '%veiculo': data?.name
              }}
              title={`Veículo ${data?.name}`}
              description={`Aqui, você irá ver os dados do veículo ${
                data?.name
              } cadastrado no dia ${dateConversor(
                data?.created_at,
                false
              )} pertencente a transportadora ${data?.transporters?.name}.`}
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
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="Nome do veículo"
                            name="name"
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Placa do veículo"
                            name="plate"
                            disabled
                          />
                        </div>
                      </div>
                      <TextArea
                        name="description"
                        label="Descrição do veículo"
                        disabled
                      />
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

export default privateRoute()(VendasTransportadorasVeiculosDetalhes);

import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';

import { useFetch } from '@/hooks/useFetch';

import { MapActionPlotArea } from '@/components/MapApp';
import Loader from '@/components/Loader';

function TalhoesInfo() {
  const router = useRouter();

  const { id, idField } = router.query;

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  const { data: dataFields, error: errorFields } = useFetch(
    `/fields/find/by/id/${idField}`
  );

  return (
    <>
      {(error || errorFields) && router.back()}
      <Head>
        <title>Talhão - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              {data && dataFields && (
                <Breadcrumb
                  path={[
                    { route: '/', name: 'Home' },
                    { route: '/propriedades', name: 'Propriedades' },
                    {
                      route: `/propriedades/${id}/detalhes`,
                      name: `${data?.name}`
                    },
                    {
                      route: `/propriedades/${id}/talhoes`,
                      name: `Talhões`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/detalhes`,
                      name: `${dataFields?.name}`
                    }
                  ]}
                />
              )}
              <h2>
                Informações do Talhão {`(${dataFields && dataFields.name})`}
              </h2>
              <p>
                Você está vendo informações detalhadas do talhão{' '}
                {dataFields && dataFields.name} da propriedade{' '}
                {dataFields && dataFields.properties.name}.
              </p>
              <Link href={`/propriedades/${id}/talhoes/${idField}/culturas`}>
                <Button className="primary">
                  <FontAwesomeIcon icon={faLeaf} /> Ver Culturas
                </Button>
              </Link>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && dataFields && (
                  <>
                    <Input
                      type="text"
                      name="name"
                      label="Nome do talhão"
                      initialValue={dataFields.name}
                      disabled
                    />
                    <div className="form-group">
                      <div>
                        <Input
                          type="number"
                          label="Área"
                          name="area"
                          initialValue={dataFields.area}
                          disabled
                        />
                      </div>
                      <div>
                        <Select
                          options={[
                            {
                              value: dataFields.type_dimension,
                              label: dataFields.type_dimension
                            }
                          ]}
                          label="Unidade de medida"
                          name="type_dimension"
                          value={dataFields.type_dimension}
                          disabled
                        />
                      </div>
                    </div>

                    <MapActionPlotArea
                      initialPosition={[
                        data.coordinates.latitude,
                        data.coordinates.longitude
                      ]}
                      initialPath={dataFields.coordinates}
                    />

                    <div className="form-group buttons">
                      <div>
                        <Button onClick={() => router.back()}>Voltar</Button>
                      </div>
                      <div>
                        <Button
                          className="primary"
                          onClick={() =>
                            router.push(
                              `/propriedades/${id}/talhoes/${idField}/editar`
                            )
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

export default privateRoute()(TalhoesInfo);

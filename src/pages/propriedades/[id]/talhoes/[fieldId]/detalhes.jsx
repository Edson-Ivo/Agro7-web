import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Form } from '@unform/web';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faHandHolding } from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';

import { useFetch } from '@/hooks/useFetch';

import { MapActionPlotArea } from '@/components/MapApp';
import Loader from '@/components/Loader';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import maskString from '@/helpers/maskString';
import useUserAccess from '@/hooks/useUserAccess';

function TalhoesInfo() {
  const router = useRouter();
  const formRef = useRef(null);

  const { id, fieldId } = router.query;

  const { data, error } = useFetch(`/properties/find/by/id/${id}`);

  const { data: dataFields, error: errorFields } = useFetch(
    `/fields/find/by/id/${fieldId}`
  );

  const { type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  const [userAccess, loadingUserAccess] = useUserAccess(route, data?.users?.id);

  useEffect(() => {
    setRoute(urlRoute(router, type));
  }, []);

  if (error || errorFields) return <Error error={error || errorFields} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Talhão {dataFields && dataFields?.name} - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%propriedade': data?.name,
                '%talhao': dataFields?.name
              }}
              title={`Informações do Talhão ${dataFields?.name}`}
              description={`Você está vendo informações detalhadas do talhão ${dataFields?.name} da propriedade ${dataFields?.properties?.name}.`}
              isLoading={isEmpty(data) || isEmpty(dataFields)}
            >
              <div className="buttons__container">
                <Link href={`${route.path}/${id}/talhoes/${fieldId}/culturas`}>
                  <Button className="primary">
                    <FontAwesomeIcon icon={faLeaf} /> Culturas
                  </Button>
                </Link>
                {userAccess && (
                  <Link href={`${route.path}/${id}/talhoes/${fieldId}/acoes`}>
                    <Button className="primary">
                      <FontAwesomeIcon icon={faHandHolding} /> Ações
                    </Button>
                  </Link>
                )}
              </div>
            </SectionHeaderContent>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && dataFields && !loadingUserAccess && (
                  <>
                    <Form
                      ref={formRef}
                      initialData={{
                        ...dataFields,
                        area: maskString(dataFields.area, 'area')
                      }}
                    >
                      <Input
                        type="text"
                        name="name"
                        label="Nome do talhão"
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
                                value: dataFields.type_dimension,
                                label: dataFields.type_dimension
                              }
                            ]}
                            label="Unidade de medida"
                            name="type_dimension"
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
                        autoCenter
                      />

                      <div className="form-group buttons">
                        <div>
                          <Button type="button" onClick={() => router.back()}>
                            Voltar
                          </Button>
                        </div>
                        {userAccess && (
                          <div>
                            <Button
                              type="button"
                              className="primary"
                              onClick={() =>
                                router.push(
                                  `${route.path}/${id}/talhoes/${fieldId}/editar`
                                )
                              }
                            >
                              Editar
                            </Button>
                          </div>
                        )}
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

export default privateRoute()(TalhoesInfo);

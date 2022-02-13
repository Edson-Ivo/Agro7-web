import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Form } from '@unform/web';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileAlt,
  faSeedling,
  faHandHolding
} from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import Loader from '@/components/Loader';

import { useFetch } from '@/hooks/useFetch';

import { dateToInput } from '@/helpers/date';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import maskString from '@/helpers/maskString';
import useUserAccess from '@/hooks/useUserAccess';

function CulturasInfo() {
  const router = useRouter();
  const { id, fieldId, cultureId } = router.query;
  const formRef = useRef(null);

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const { type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  const [userAccess, loadingUserAccess] = useUserAccess(
    route,
    data?.properties?.users?.id
  );

  useEffect(() => {
    setRoute(urlRoute(router, type));
  }, []);

  if (error || errorCultures) return <Error error={error || errorCultures} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Cultura - Agro9</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%propriedade': data?.properties.name,
                '%talhao': data?.name,
                '%cultura': dataCultures?.products?.name
              }}
              title={`Informações Cultura ${dataCultures?.products?.name}`}
              description={`Você está vendo informações detalhadas da cultura de ${dataCultures?.products?.name} no talhão ${data?.name} da propriedade ${data?.properties?.name}.`}
              isLoading={
                isEmpty(data) || isEmpty(dataCultures) || loadingUserAccess
              }
            >
              <div className="buttons__container">
                <Link
                  href={`${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/relatorios`}
                >
                  <Button className="primary">
                    <FontAwesomeIcon icon={faFileAlt} /> Relatórios Técnicos
                  </Button>
                </Link>
                {userAccess && (
                  <>
                    <Link
                      href={`${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/relatorio`}
                    >
                      <Button className="primary">
                        <FontAwesomeIcon icon={faFileAlt} /> Relatório
                      </Button>
                    </Link>
                    <Link
                      href={`${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/colheitas`}
                    >
                      <Button className="primary">
                        <FontAwesomeIcon icon={faSeedling} /> Colheitas
                      </Button>
                    </Link>
                    <Link
                      href={`${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/acoes`}
                    >
                      <Button className="primary">
                        <FontAwesomeIcon icon={faHandHolding} /> Ações
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SectionHeaderContent>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && dataCultures && !loadingUserAccess && (
                  <>
                    <Form
                      ref={formRef}
                      initialData={{
                        ...dataCultures,
                        date_start: dateToInput(dataCultures?.date_start),
                        date_finish: dataCultures?.date_finish
                          ? dateToInput(dataCultures?.date_finish)
                          : null,
                        area: maskString(dataCultures?.area, 'area')
                      }}
                    >
                      <Select
                        name="products.id"
                        label="Produto:"
                        options={[
                          {
                            value: dataCultures?.products.id,
                            label: dataCultures?.products.name
                          }
                        ]}
                        disabled
                      />

                      <div className="form-group">
                        <div>
                          <Input
                            type="date"
                            label="Data"
                            name="date_start"
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="date"
                            label="Data de Término"
                            name="date_finish"
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
                            disabled
                          />
                        </div>
                        <div>
                          <Select
                            options={[
                              {
                                value: dataCultures?.type_dimension,
                                label: dataCultures?.type_dimension
                              }
                            ]}
                            label="Unidade de medida"
                            name="type_dimension"
                            disabled
                          />
                        </div>
                      </div>

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
                                  `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/editar`
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

export default privateRoute()(CulturasInfo);

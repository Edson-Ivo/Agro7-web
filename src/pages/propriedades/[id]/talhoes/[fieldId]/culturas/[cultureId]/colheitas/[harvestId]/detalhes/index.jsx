import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox } from '@fortawesome/free-solid-svg-icons';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import Loader from '@/components/Loader';
import Select from '@/components/Select';

import { useFetch } from '@/hooks/useFetch';
import { dateConversor, dateToInput } from '@/helpers/date';
import Error from '@/components/Error/index';
import urlRoute from '@/helpers/urlRoute';
import { useSelector } from 'react-redux';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import usersTypes from '@/helpers/usersTypes';

function ColheitasDetalhes() {
  const formRef = useRef(null);
  const router = useRouter();

  const { id, fieldId, cultureId, harvestId } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const { data: dataHarvests, error: errorHarvests } = useFetch(
    `/harvests/find/by/id/${harvestId}`
  );

  const { type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  useEffect(() => {
    setRoute(urlRoute(router, type, [usersTypes[3], usersTypes[4]]));
  }, []);

  const handleCancel = () => {
    router.back();
  };

  if (error || errorCultures || errorHarvests)
    return <Error error={error || errorCultures || errorHarvests} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && fieldId !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Detalhes da Colheita - Agro9</title>
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
                '%cultura': dataCultures?.products?.name,
                '%data': dateConversor(dataHarvests?.date, false)
              }}
              title={`Detalhes da Colheita na Cultura de ${dataCultures?.products?.name}`}
              description={`Aqui, você irá ver detalhes da colheita da cultura de ${dataCultures?.products?.name} do talhão ${data?.name} da propriedade ${data?.properties.name}.`}
              isLoading={
                isEmpty(data) || isEmpty(dataCultures) || isEmpty(dataHarvests)
              }
            >
              <Link
                href={`${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/colheitas/${harvestId}/detalhes/estoque`}
              >
                <Button className="primary">
                  <FontAwesomeIcon icon={faBox} /> Estoque
                </Button>
              </Link>
            </SectionHeaderContent>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && dataCultures && dataHarvests && (
                  <>
                    <Form
                      ref={formRef}
                      initialData={{
                        ...dataHarvests,
                        date: dateToInput(dataHarvests?.date),
                        forecast: dateToInput(dataHarvests?.forecast),
                        quantity: `${dataHarvests?.quantity}${dataHarvests?.type}`,
                        quantity_forecast: `${dataHarvests?.quantity}${dataHarvests?.type}`,
                        is_green: String(dataHarvests?.is_green)
                      }}
                    >
                      <div className="form-group">
                        <div>
                          <Input
                            type="date"
                            label="Data"
                            name="date"
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Quantidade"
                            name="quantity"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <Input
                            type="date"
                            label="Data de Previsão"
                            name="forecast"
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Quantidade Prevista"
                            name="quantity_forecast"
                            disabled
                          />
                        </div>
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

                      <div className="form-group buttons">
                        <div>
                          <Button type="button" onClick={handleCancel}>
                            Voltar
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

export default privateRoute()(ColheitasDetalhes);

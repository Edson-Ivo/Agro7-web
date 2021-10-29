import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import Loader from '@/components/Loader';

import { useFetch } from '@/hooks/useFetch';
import { dateConversor, dateToInput } from '@/helpers/date';
import Error from '@/components/Error/index';
import urlRoute from '@/helpers/urlRoute';
import { useSelector } from 'react-redux';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import usersTypes from '@/helpers/usersTypes';

function EstoqueColheitasDetalhes() {
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

  const { data: dataStock, error: errorStock } = useFetch(
    `harvests-stocks/find/by/harvest/${harvestId}`
  );

  const { type } = useSelector(state => state.user);
  const [route, setRoute] = useState({});

  useEffect(() => {
    setRoute(urlRoute(router, type, [usersTypes[3], usersTypes[4]]));
  }, []);

  const handleCancel = () => {
    router.back();
  };

  if (error || errorCultures || errorHarvests || errorStock)
    return (
      <Error error={error || errorCultures || errorHarvests || errorStock} />
    );
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && fieldId !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Estoque da Colheita - Agro7</title>
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
              title={`Estoque da Colheita na Cultura de ${dataCultures?.products?.name}`}
              description={`Aqui, você irá ver o estoque da colheita da cultura de ${dataCultures?.products?.name} do talhão ${data?.name} da propriedade ${data?.properties.name}.`}
              isLoading={
                isEmpty(data) || isEmpty(dataCultures) || isEmpty(dataHarvests)
              }
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && dataCultures && dataHarvests && dataStock && (
                  <>
                    <Form
                      ref={formRef}
                      initialData={{
                        ...dataStock,
                        stocked: `${dataStock?.items[0].quantity}${dataStock?.items[0].harvests.type}`,
                        general: `${dataStock?.items[0].harvests.quantity}${dataStock?.items[0].harvests.type}`,
                        lastestUpdate: dateToInput(
                          dataStock?.items[0].updated_at
                        )
                      }}
                    >
                      <div className="form-group">
                        <div>
                          <Input
                            type="text"
                            label="Quantidade em Estoque"
                            name="stocked"
                            disabled
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            label="Quantidade Geral"
                            name="general"
                            disabled
                          />
                        </div>
                      </div>

                      <Input
                        type="date"
                        label="Atualizado em:"
                        name="lastestUpdate"
                        disabled
                      />

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

export default privateRoute()(EstoqueColheitasDetalhes);

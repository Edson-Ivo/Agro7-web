import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import Loader from '@/components/Loader';

import { useFetch } from '@/hooks/useFetch';
import Error from '@/components/Error/index';
import { useSelector } from 'react-redux';
import urlRoute from '@/helpers/urlRoute';
import isEmpty from '@/helpers/isEmpty';
import { actionsList } from '@/services/CulturesActionsService';
import objectKeyExists from '@/helpers/objectKeyExists';
import CulturesActionsForm from '@/components/CultureActionsForm';
import { dateToInput, removeTimeSeconds } from '@/helpers/date';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

function AcoesCulturasDetalhes() {
  const formRef = useRef(null);
  const [route, setRoute] = useState({});
  const [baseUrl, setBaseUrl] = useState('');

  const router = useRouter();
  const { id, fieldId, cultureId, actionId, type: typeAction } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${fieldId}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${cultureId}`
  );

  const { data: dataActions, error: errorActions } = useFetch(
    `/cultures-${typeAction}/find/by/id/${actionId}`
  );

  const { type } = useSelector(state => state.user);

  useEffect(() => {
    setRoute(urlRoute(router, type, ['tecnico']));
  }, []);

  useEffect(() => {
    setBaseUrl(
      `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/acoes`
    );
  }, [route]);

  const handleCancel = () => {
    router.back();
  };

  if (error || errorCultures || errorActions)
    return <Error error={error || errorCultures || errorActions} />;
  if (data && id !== String(data?.properties?.id)) return <Error error={404} />;
  if (dataCultures && fieldId !== String(dataCultures?.fields?.id))
    return <Error error={404} />;
  if (!isEmpty(route) && !route.hasPermission) return <Error error={404} />;
  if (!objectKeyExists(actionsList, typeAction)) return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Detalhes da Ação na Cultura - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumb={[
                { route: '/', name: 'Home' },
                {
                  route: '/admin',
                  name: 'Painel Administrativo',
                  active: type === 'administrador' && route?.permission === type
                },
                { route: `${route.path}`, name: 'Propriedades' },
                {
                  route: `${route.path}/${id}/detalhes`,
                  name: `${data?.properties?.name}`
                },
                {
                  route: `${route.path}/${id}/talhoes`,
                  name: `Talhões`
                },
                {
                  route: `${route.path}/${id}/talhoes/${fieldId}/detalhes`,
                  name: `${data?.name}`
                },
                {
                  route: `${route.path}/${id}/talhoes/${fieldId}/culturas`,
                  name: `Culturas`
                },
                {
                  route: `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/detalhes`,
                  name: `${dataCultures?.products?.name}`
                },
                {
                  route: `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/acoes`,
                  name: `Ações`
                },
                {
                  route: `${route.path}/${id}/talhoes/${fieldId}/culturas/${cultureId}/acoes/${typeAction}/${actionId}/detalhes`,
                  name: `Detalhes`
                }
              ]}
              title={`Detalhes da Ação de ${actionsList[typeAction]?.label} na Cultura de ${dataCultures?.products?.name}`}
              description={`Aqui você irá vizualizar a ação ${actionsList[
                typeAction
              ]?.label.toLowerCase()} em questão na cultura de ${
                dataCultures?.products?.name
              } do talhão ${data?.name} da propriedade ${
                data?.properties?.name
              }.`}
              isLoading={
                isEmpty(data) || isEmpty(dataCultures) || isEmpty(dataActions)
              }
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && dataCultures && dataActions && (
                  <>
                    <Form
                      ref={formRef}
                      initialData={{
                        ...dataActions,
                        date_start: dateToInput(dataActions?.date_start),
                        date_finish: dateToInput(dataActions?.date_finish),
                        time_start: removeTimeSeconds(dataActions?.time_start),
                        time_finish: removeTimeSeconds(
                          dataActions?.time_finish
                        ),
                        supplies: dataActions?.supplies?.id
                      }}
                    >
                      <CulturesActionsForm
                        typeAction={typeAction}
                        cultureId={cultureId}
                        dataAction={dataActions}
                        details
                      />

                      <div className="form-group buttons">
                        <div>
                          <Button type="button" onClick={handleCancel}>
                            Voltar
                          </Button>
                        </div>

                        <div>
                          <Button
                            type="button"
                            className="primary"
                            onClick={() =>
                              router.push(
                                `${baseUrl}/${typeAction}/${actionId}/editar`
                              )
                            }
                          >
                            Editar
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

export default privateRoute()(AcoesCulturasDetalhes);

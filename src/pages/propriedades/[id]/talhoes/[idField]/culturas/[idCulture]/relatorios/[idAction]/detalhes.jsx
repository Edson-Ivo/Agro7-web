import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Button from '@/components/Button';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import Loader from '@/components/Loader';

import { useFetch } from '@/hooks/useFetch';
import TextArea from '@/components/TextArea';
import Select from '@/components/Select';

function RelatoriosEdit() {
  const router = useRouter();
  const { id, idField, idCulture, idAction } = router.query;

  const { data, error } = useFetch(`/fields/find/by/id/${idField}`);

  const { data: dataCultures, error: errorCultures } = useFetch(
    `/cultures/find/by/id/${idCulture}`
  );

  const { data: dataActions, error: errorActions } = useFetch(
    `/technician-actions/find/by/id/${idAction}`
  );

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      {(error || errorCultures || errorActions) && router.back()}
      {data && id !== data?.properties?.id.toString() && router.back()}
      {dataCultures &&
        idField !== dataCultures?.fields?.id.toString() &&
        router.back()}
      <Head>
        <title>Relatório - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              {data && dataCultures && (
                <Breadcrumb
                  path={[
                    { route: '/', name: 'Home' },
                    { route: '/propriedades', name: 'Propriedades' },
                    {
                      route: `/propriedades/${id}/detalhes`,
                      name: `${data?.properties.name}`
                    },
                    {
                      route: `/propriedades/${id}/talhoes`,
                      name: `Talhões`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/detalhes`,
                      name: `${data?.name}`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/culturas`,
                      name: `Culturas`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/culturas/${idCulture}/detalhes`,
                      name: `${dataCultures?.products.name}`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/culturas/${idCulture}/relatorios`,
                      name: `Relatórios`
                    },
                    {
                      route: `/propriedades/${id}/talhoes/${idField}/culturas/${idCulture}/relatorios/${idAction}/detalhes`,
                      name: `Detalhes`
                    }
                  ]}
                />
              )}
              <h2>Relatório da Cultura de {dataCultures?.products.name}</h2>
              <p>
                Aqui você vendo o relatório da cultura de{' '}
                {dataCultures?.products.name} do talhão{' '}
                {`${data?.name} da propriedade ${data?.properties.name}`}.
              </p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {(data && dataCultures && dataActions && (
                  <>
                    <TextArea
                      name="diagnostics"
                      label="Diagnóstico da Cultura"
                      initialValue={dataActions?.diagnostics}
                      disabled
                    />
                    <TextArea
                      name="adultery"
                      label="#adultery da Cultura"
                      initialValue={dataActions?.adultery}
                      disabled
                    />
                    <TextArea
                      name="cultivation"
                      label="Tratos Culturais"
                      initialValue={dataActions?.cultivation}
                      disabled
                    />
                    <Select
                      options={[
                        { value: 'true', label: 'Sim' },
                        { value: 'false', label: 'Não' }
                      ]}
                      label="Está adubada?"
                      name="fertilizing"
                      value={dataActions?.fertilizing.toString()}
                      disabled
                    />
                    <TextArea
                      name="plant_health"
                      label="Fitossanidade"
                      initialValue={dataActions?.plant_health}
                      disabled
                    />

                    <div className="form-group buttons">
                      <div>
                        <Button type="button" onClick={handleCancel}>
                          Cancelar
                        </Button>
                      </div>

                      <div>
                        <Button className="primary">Editar Relatório</Button>
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

export default privateRoute()(RelatoriosEdit);

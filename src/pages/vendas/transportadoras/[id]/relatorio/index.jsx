import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';

import Loader from '@/components/Loader';
import Error from '@/components/Error';
import { useFetch } from '@/hooks/useFetch';

import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import PDFViewer from '@/components/PDFViewer/index';
import SearchSelect from '@/components/SearchSelect/index';
import SalesService from '@/services/SalesService';
import Select from '@/components/Select/index';
import Button from '@/components/Button/index';
import { Alert } from '@/components/Alert/index';

function VendasTransportadorasRelatorio() {
  const formRef = useRef(null);
  const [disabledButton, setDisableButton] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [catch400Error, setCatch400Error] = useState(false);
  const [saveError, setSaveError] = useState({});
  const [property, setProperty] = useState('');
  const [loadingTransporterVehicles, setLoadingTransporterVehicles] = useState(
    false
  );
  const [distributor, setDistributor] = useState('');
  const [transporterVehicle, setTransporterVehicle] = useState('');
  const [transporterVehiclesOptions, setTransporterVehiclesOptions] = useState(
    []
  );

  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useFetch(`/transporters/find/by/id/${id}`);

  const { data: dataReport, error: errorReport } = useFetch(
    id && property && distributor && transporterVehicle
      ? `/transporters/generate/report/by/id/${id}/property/${property}/vehicle/${transporterVehicle}/distributor/${distributor}`
      : null,
    true
  );

  const handleSetProperty = e => {
    setProperty(e?.value);
    setLoadingTransporterVehicles(true);
  };

  const handleSubmitFilter = dt => {
    setDisableButton(true);
    setAlert({
      type: '',
      message: ''
    });

    let isValidSubmit = false;

    Object.keys(dt).forEach(key => {
      if (!isEmpty(dt[key])) isValidSubmit = true;
      else isValidSubmit = false;
    });

    if (isValidSubmit) {
      setProperty(dt.properties);
      setDistributor(dt.distributors);
      setTransporterVehicle(dt.transporter_vehicles);
    } else {
      setAlert({
        type: 'error',
        message: 'Preencha todos os campos!'
      });
    }

    setTimeout(() => {
      setDisableButton(false);
    }, 500);
  };

  useEffect(() => {
    if (!isEmpty(property)) {
      SalesService.getTransporterVehiclesByProperty(property).then(
        ({ data: dataVehicles }) => {
          if (!isEmpty(dataVehicles?.items)) {
            const d = dataVehicles?.items;

            const vehiclesOptions = [];
            Object.keys(d).forEach(el => {
              const { name, plate, id: vId } = d[el];

              vehiclesOptions.push({
                value: vId,
                label: `${name} - ${plate}`
              });
            });

            setTransporterVehiclesOptions(vehiclesOptions);
          }
        }
      );

      setLoadingTransporterVehicles(false);
    }
  }, [property]);

  useEffect(() => {
    if (!saveError && saveError?.status !== 400) {
      setAlert({
        type: '',
        message: ''
      });
    }
  }, [saveError]);

  useEffect(() => {
    setCatch400Error(false);

    setSaveError(errorReport?.response);

    if (errorReport?.response?.status === 400) {
      setCatch400Error(true);

      (async () => {
        const resError = await errorReport?.response?.data.text();

        setAlert({
          type: 'error',
          message: JSON.parse(resError)?.message
        });
      })();
    }
  }, [errorReport]);

  if ((errorReport || error) && errorReport?.response?.status !== 400)
    return <Error error={errorReport || error} />;

  return (
    <>
      <Head>
        <title>Relatório da Transportadora {data && data?.name} - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%transportadora': data?.name
              }}
              title={`Relatório da Transportadora ${data?.name}`}
              isLoading={isEmpty(data)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {data && (
                  <>
                    <Alert type="info">
                      Selecione uma propriedade que já teve uma venda com a
                      transportadora {data?.name}, uma distribuidora com essa
                      venda e o veículo da transportadora:
                    </Alert>

                    {alert.message !== '' && (
                      <Alert type={alert.type}>{alert.message}</Alert>
                    )}

                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmitFilter}
                      style={{ marginBottom: 10 }}
                    >
                      <SearchSelect
                        name="properties"
                        options
                        label="Selecione a propriedade:"
                        onChange={handleSetProperty}
                        url={`/properties/find/by/transporter/${id}`}
                        limit={30}
                      />

                      {property && (
                        <>
                          {(!loadingTransporterVehicles && (
                            <>
                              <SearchSelect
                                name="distributors"
                                options
                                label="Selecione a distribuidora:"
                                url={`/distributors/find/by/property/${property}`}
                                limit={30}
                              />

                              <Select
                                name="transporter_vehicles"
                                options={transporterVehiclesOptions}
                                label="Selecione o veículo:"
                              />
                            </>
                          )) || <Loader />}
                        </>
                      )}

                      <Button
                        type="submit"
                        className="primary"
                        disabled={disabledButton}
                      >
                        Gerar Relatório
                      </Button>
                    </Form>

                    {property &&
                      distributor &&
                      transporterVehicle &&
                      !catch400Error && (
                        <>
                          {(!isEmpty(dataReport) && (
                            <PDFViewer
                              src={`${dataReport}`}
                              name={`Relatório da Transportadora ${data?.name}`}
                              pdfName={`Relatório da Transportadora ${data?.name}.pdf`}
                              alertMessage="Se você não conseguir abrir ou visualizar o relatório, baixe-o no botão abaixo:"
                              downloadMessage="Baixar Relatório"
                              fitH
                            />
                          )) || <Loader />}
                        </>
                      )}
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

export default privateRoute()(VendasTransportadorasRelatorio);

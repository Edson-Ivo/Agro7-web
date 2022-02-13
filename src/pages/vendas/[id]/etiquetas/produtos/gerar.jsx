import React, { useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { privateRoute } from '@/components/PrivateRoute';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import { useFetch } from '@/hooks/useFetch';
import Error from '@/components/Error/index';
import { CardContainer } from '@/components/CardContainer/index';
import { Alert } from '@/components/Alert/index';
import Loader from '@/components/Loader/index';
import PDFViewer from '@/components/PDFViewer/index';
import Input from '@/components/Input/index';
import Button from '@/components/Button/index';

import isEmpty from '@/helpers/isEmpty';
import { dateToISOString, getCurrentDate, isValidDate } from '@/helpers/date';

function VendasEtiquetasProdutos() {
  const formRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [validate, setValidate] = useState(null);

  const router = useRouter();

  const { id } = router.query;

  const { data: dataSale, error: errorSale } = useFetch(
    `/sales/find/by/id/${id}`
  );

  const { data: dataLabel, error: errorLabel } = useFetch(
    dataSale && validate
      ? `/sales/generate/sale-label/by/id/${dataSale?.id}?date_validate=${validate}`
      : null,
    true
  );

  const handleSubmit = dt => {
    setDisableButton(true);
    setAlert({ type: '', message: '' });

    const schema = yup.object().shape({
      validate: yup.string().required('O campo data de validade é obrigatório!')
    });

    schema
      .validate(dt)
      .then(async d => {
        if (isValidDate(d.validate)) {
          const date = dateToISOString(d.validate);
          const dateSale = dataSale?.date;

          if (getCurrentDate(dateSale).diff(date) < 0) {
            setValidate(date);
          } else {
            setAlert({
              type: 'error',
              message:
                'A data da validade não pode ser anterior a data da venda'
            });
          }
        }
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
        setDisableButton(false);

        if (err instanceof yup.ValidationError) {
          const { path, message } = err;

          formRef.current.setFieldError(path, message);
        }
      });

    setTimeout(() => {
      setDisableButton(false);
    }, 1000);
  };

  if (errorSale || errorLabel) return <Error error={errorSale || errorLabel} />;

  return (
    <>
      <Head>
        <title>
          Etiqueta sem Informações Nutricionais de Produto da Venda{' '}
          {dataSale && dataSale?.batch} - Agro9
        </title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%lote': dataSale?.batch
              }}
              title={`Etiqueta sem Informações Nutricionais de Produto da Venda ${dataSale?.batch}`}
              description={`Aqui, você irá gerar uma etiqueta sem Informações Nutricionais de 25x40x4 para Produtos Embalados da Venda ${dataSale?.batch}.`}
              isLoading={isEmpty(dataSale)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                {(dataSale && (
                  <>
                    {!validate && (
                      <Alert type="info">
                        Selecione a data de validade que vai em cada embalagem
                        primeiro:
                      </Alert>
                    )}
                    <div style={{ marginBottom: 25 }}>
                      <Form ref={formRef} onSubmit={handleSubmit}>
                        <Input
                          type="date"
                          label="Validade do produto:"
                          name="validate"
                          required
                        />
                        <Button
                          type="submit"
                          className="primary"
                          disabled={disableButton}
                        >
                          Gerar Etiqueta
                        </Button>
                      </Form>
                    </div>
                    {validate && !errorLabel && (
                      <>
                        {(!isEmpty(dataLabel) && (
                          <PDFViewer
                            src={`${dataLabel}`}
                            name="Etiqueta sem Informações Nutricionais de Produto"
                            pdfName={`Venda ${dataSale?.batch} - Etiqueta sem Informações Nutricionais de Produto.pdf`}
                            alertMessage="Se você não conseguir abrir ou visualizar a etiqueta, baixe-a no botão abaixo:"
                            downloadMessage="Baixar Etiqueta"
                            fitH
                          />
                        )) || <Loader />}
                      </>
                    )}
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

export default privateRoute()(VendasEtiquetasProdutos);

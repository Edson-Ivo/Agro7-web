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
import isEmpty from '@/helpers/isEmpty';
import { CardContainer } from '@/components/CardContainer/index';
import { Alert } from '@/components/Alert/index';
import Loader from '@/components/Loader/index';
import PDFViewer from '@/components/PDFViewer/index';
import Input from '@/components/Input/index';
import Button from '@/components/Button/index';
import { dateToISOString, getCurrentDate, isValidDate } from '@/helpers/date';

function VendasEtiquetasProdutosNutricional() {
  const formRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [quantity, setQuantity] = useState(null);
  const [validate, setValidate] = useState(null);

  const router = useRouter();
  const { id } = router.query;

  const { data: dataSale, error: errorSale } = useFetch(
    `/sales/find/by/id/${id}`
  );

  const { data: dataLabel, error: errorLabel } = useFetch(
    dataSale && quantity && validate
      ? `/sales/generate/product-label/by/id/${dataSale?.id}?quantity=${quantity}&date_validate=${validate}`
      : null,
    true
  );

  const handleSubmit = dt => {
    setDisableButton(true);
    setAlert({ type: '', message: '' });

    const maxQtd = dataSale?.total_quantity;

    const schema = yup.object().shape({
      quantity: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('Quantidade deve ser maior que 0')
        .max(maxQtd, `Quantidade deve ser menor ou igual à ${maxQtd}`)
        .required('O campo quantidade é obrigatório'),
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
            setQuantity(d.quantity);
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
          Etiqueta com Informações Nutricionais de Produto da Venda{' '}
          {dataSale && dataSale?.batch} - Agro7
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
              title={`Etiqueta com Informações Nutricionais de Produto da Venda ${dataSale?.batch}`}
              description={`Aqui, você irá gerar uma etiqueta com Informações Nutricionais de 50x100x2 para Produtos Embalados da Venda ${dataSale?.batch}.`}
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
                    {!quantity && !validate && (
                      <Alert type="info">
                        Selecione a quantidade e a data de validade que vai em
                        cada embalagem primeiro:
                      </Alert>
                    )}
                    <h4>
                      Quantidade Máxima: {dataSale?.total_quantity}
                      {dataSale?.type_unity}
                    </h4>
                    <div style={{ marginBottom: 25 }}>
                      <Form ref={formRef} onSubmit={handleSubmit}>
                        <Input
                          type="number"
                          label="Quantidade de cada embalagem:"
                          name="quantity"
                          min="1"
                          max={dataSale?.total_quantity}
                          required
                        />
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
                    {quantity && validate && !errorLabel && (
                      <>
                        {(!isEmpty(dataLabel) && (
                          <PDFViewer
                            src={`${dataLabel}`}
                            name="Etiqueta com Informações Nutricionais de Produto"
                            pdfName={`Venda ${dataSale?.batch} - Etiqueta com Informações Nutricionais de Produto.pdf`}
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

export default privateRoute()(VendasEtiquetasProdutosNutricional);

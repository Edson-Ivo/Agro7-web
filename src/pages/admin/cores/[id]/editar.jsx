import React, { useState, useRef } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';

import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import Error from '@/components/Error';
import errorMessage from '@/helpers/errorMessage';
import ColorsService from '@/services/ColorsService';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader/index';
import InputColor from '@/components/InputColor/index';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';

const schema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório!'),
  hexadecimal: yup
    .string()
    .required('O campo escolha a cor é obrigatório!')
    .matches(
      '^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})',
      'Código hexadecimal da cor inválido'
    )
});

function AdminCoresEdit() {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const formRef = useRef(null);
  const router = useRouter();

  const { id } = router.query;
  const { data: dataColor, error, mutate } = useFetch(
    `/colors/find/by/id/${id}`
  );

  const handleSubmit = async data => {
    setDisableButton(true);

    schema
      .validate(data)
      .then(async d => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        d.hexadecimal = d.hexadecimal.replaceAll('#', '');

        await ColorsService.update(id, d).then(res => {
          if (res.status !== 200 || res?.statusCode) {
            setAlert({ type: 'error', message: errorMessage(res) });
            setTimeout(() => {
              setDisableButton(false);
            }, 1000);
          } else {
            mutate();

            setAlert({
              type: 'success',
              message: 'Cor editada com sucesso!'
            });

            setTimeout(() => {
              router.push('/admin/cores/');
              setDisableButton(false);
            }, 1000);
          }
        });
      })
      .catch(err => {
        setAlert({ type: 'error', message: err.errors[0] });
        setDisableButton(false);
      });
  };

  if (error) return <Error error={error} />;

  return (
    <>
      <Head>
        <title>Painel Administrativo | Editar Cor - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%cor': dataColor?.name
              }}
              title="Editar Cor"
              description="Aqui, você irá editar a cor em questão"
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                {(dataColor && (
                  <>
                    <Form
                      ref={formRef}
                      method="post"
                      onSubmit={handleSubmit}
                      initialData={{
                        ...dataColor
                      }}
                    >
                      <Input type="text" label="Nome" name="name" required />
                      <InputColor
                        name="hexadecimal"
                        initialValue={`#${dataColor.hexadecimal}`}
                      />

                      <div className="form-group buttons">
                        <div>
                          <Button type="button" onClick={() => router.back()}>
                            Voltar
                          </Button>
                        </div>
                        <div>
                          <Button
                            disabled={disableButton}
                            className="primary"
                            type="submit"
                          >
                            Salvar Edição
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

export default privateRoute(['administrador'])(AdminCoresEdit);

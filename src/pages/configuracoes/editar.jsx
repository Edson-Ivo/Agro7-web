import React, { useState } from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import Link from 'next/link';

import Container from '../../components/Container';
import Nav from '../../components/Nav';
import Navbar from '../../components/Navbar';
import Breadcrumb from '../../components/Breadcrumb';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { Alert } from '../../components/Alert';
import { Section, SectionHeader, SectionBody } from '../../components/Section';

import Error from '../../components/Error';
import { CardContainer } from '../../components/CardContainer';
import { privateRoute } from '../../components/PrivateRoute';
import Loader from '../../components/Loader';

import UsersServices from '../../services/UsersServices';
import errorMessage from '../../helpers/errorMessage';
import { useFetch } from '../../hooks/useFetch';
import getFormData from '../../helpers/getFormData';

function ConfiguracoesEdit() {
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { id } = useSelector(state => state.user);

  const { data, error } = useFetch(`/users/find/by/id/${id}`);

  const handleSubmit = async event => {
    event.preventDefault();

    const formData = getFormData(event, {
      name: null,
      phone: null,
      phone_whatsapp: null,
      types: data?.types
    });

    if (formData.name && formData.phone) {
      setLoading(true);

      await UsersServices.updateByOwner(formData).then(res => {
        if (res.status !== 200 || res?.statusCode) {
          setAlertMsg(errorMessage(res));
        } else {
          setAlertMsg({
            type: 'success',
            message: 'Dados alterados com sucesso!'
          });
        }

        setLoading(false);
      });
    } else {
      setAlertMsg({
        type: 'error',
        message: 'Preencha todos os campos requeridos.'
      });
    }
  };

  if (error) return <Error />;

  return (
    <>
      <Head>
        <title>Editar Dados - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <div className="SectionHeader__content">
              <Breadcrumb
                path={[
                  { route: '/', name: 'Home' },
                  { route: '/configuracoes', name: 'Configurações' },
                  { route: '/configuracoes/editar', name: 'Editar Dados' }
                ]}
              />
              <h2>Editar dados</h2>
              <p>Edite abaixo os dados de sua conta.</p>
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alertMsg.message && (
                  <Alert type={alertMsg.type}>{alertMsg.message}</Alert>
                )}
                {(data && (
                  <form method="post" onSubmit={event => handleSubmit(event)}>
                    <Input
                      type="text"
                      label="Nome"
                      name="name"
                      initialValue={data.name}
                      required
                    />
                    <div className="form-group">
                      <div>
                        <Input
                          type="text"
                          label="Número Telefone"
                          name="phone"
                          mask="phone"
                          maxLength={15}
                          initialValue={data.phone}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          label="Número Whatsapp"
                          name="phone_whatsapp"
                          mask="phone"
                          maxLength={15}
                          initialValue={data.phone_whatsapp}
                        />
                      </div>
                    </div>
                    {(!loading && (
                      <div className="form-group buttons">
                        <div>
                          <Button className="primary" type="submit">
                            Salvar
                          </Button>
                        </div>
                        <div>
                          <Link href="/configuracoes">
                            <Button>Cancelar</Button>
                          </Link>
                        </div>
                      </div>
                    )) || <Loader />}
                  </form>
                )) || <Loader />}
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(ConfiguracoesEdit);

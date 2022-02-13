import React, { useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';
import { Form } from '@unform/web';

import { Alert } from '@/components/Alert';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import Input from '@/components/Input';
import Button from '@/components/Button';
import Error from '@/components/Error';
import Loader from '@/components/Loader';
import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { useFetch } from '@/hooks/useFetch';

import errorMessage from '@/helpers/errorMessage';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import ProfilesService from '@/services/ProfilesService';
import TextArea from '@/components/TextArea/index';
import ImageContainer from '@/components/ImageContainer/index';
import isEmpty from '@/helpers/isEmpty';
import Table from '@/components/Table/index';
import ActionButton from '@/components/ActionButton/index';
import { useModal } from '@/hooks/useModal';

function ConfiguracoesPerfil() {
  const formRef = useRef(null);

  const router = useRouter();

  const { addModal, removeModal } = useModal();
  const [activeStep, setActiveStep] = useState(1);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const { data, error } = useFetch(`/users-profiles/find/by/user-logged`);

  const {
    data: dataGallery,
    error: errorGallery,
    mutate: mutateGallery
  } = useFetch(`/profiles-galleries/find/by/user-logged?limit=20&page=1`);

  const handleDelete = useCallback(
    async identifier => {
      removeModal();
      setLoading(true);

      setAlert({
        type: 'success',
        message: 'Deletando imagem...'
      });

      await ProfilesService.deleteGallery(identifier).then(res => {
        if (res.status >= 400 || res?.statusCode) {
          setAlert({ type: 'error', message: errorMessage(res) });
        } else {
          mutateGallery();

          setAlert({
            type: 'success',
            message: 'Imagem da galeria deletada com sucesso!'
          });
        }
      });

      setLoading(false);
    },
    [addModal, removeModal]
  );

  const handleDeleteModal = useCallback(
    identifier => {
      addModal({
        title: 'Deletar Imagem?',
        text: 'Deseja realmente deletar esta imagem?',
        confirm: true,
        onConfirm: () => handleDelete(identifier),
        onCancel: removeModal
      });
    },
    [addModal, removeModal]
  );

  if (error || errorGallery) return <Error error={error || errorGallery} />;

  return (
    <>
      <Head>
        <title>Perfil público - Agro9</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title="Perfil Público"
              description="Edite abaixo os dados de seu perfil público."
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message && (
                  <Alert type={alert.type}>{alert.message}</Alert>
                )}
                {(data && (
                  <Form
                    ref={formRef}
                    method="post"
                    initialData={{
                      ...data
                    }}
                  >
                    <MultiStep activeStep={activeStep}>
                      <Step label="Perfil" onClick={() => setActiveStep(1)}>
                        {(data?.image_url && (
                          <ImageContainer
                            src={data?.image_url}
                            alt="Sua Foto de Perfil atual"
                            label="Sua Foto de Perfil atual"
                            zoom
                          />
                        )) || (
                          <Alert type="error">
                            Você não tem foto de perfil
                          </Alert>
                        )}
                        <Input
                          type="text"
                          name="video_url"
                          label="Link do vídeo de introdução no YouTube"
                          disabled
                        />
                        <TextArea name="about" label="Sobre mim" disabled />
                      </Step>
                      <Step label="Galeria" onClick={() => setActiveStep(2)}>
                        {(dataGallery && !loading && (
                          <>
                            <h4 style={{ marginBottom: 8, marginLeft: 10 }}>
                              Imagens da Galeria:
                            </h4>

                            <div className="table-responsive">
                              <Table>
                                <thead>
                                  <tr>
                                    <th>Imagem</th>
                                    <th>Ações</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(!isEmpty(dataGallery?.items) &&
                                    dataGallery.items.map((p, i) => (
                                      <tr
                                        key={p.id}
                                        onClick={() =>
                                          router.push(`${p?.image_url}`)
                                        }
                                      >
                                        <td>
                                          <div
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center'
                                            }}
                                          >
                                            <Image
                                              src={p?.image_url}
                                              alt={`Imagem ${i + 1}`}
                                              width={100}
                                              height={60}
                                            />{' '}
                                            <b style={{ marginLeft: '10px' }}>
                                              Imagem {i + 1}
                                            </b>
                                          </div>
                                        </td>
                                        <td onClick={e => e.stopPropagation()}>
                                          <ActionButton
                                            id={p.id}
                                            download={p?.image_url}
                                            noEdit
                                            noInfo
                                            onDelete={() =>
                                              handleDeleteModal(p.id)
                                            }
                                          />
                                        </td>
                                      </tr>
                                    ))) || (
                                    <tr>
                                      <td colSpan="2">
                                        Não há imagens nessa galeria
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </Table>
                            </div>
                          </>
                        )) || <Loader />}
                      </Step>
                    </MultiStep>

                    <div className="form-group buttons">
                      <div>
                        <Button type="button" onClick={() => router.back()}>
                          Voltar
                        </Button>
                      </div>
                      <div>
                        <Button
                          type="button"
                          className="primary"
                          onClick={() =>
                            router.push(`/configuracoes/perfil/editar`)
                          }
                        >
                          Editar Perfil
                        </Button>
                      </div>
                    </div>
                  </Form>
                )) || <Loader />}
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute()(ConfiguracoesPerfil);

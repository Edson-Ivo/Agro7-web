import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import FileInput from '@/components/FileInput/index';
import ImageContainer from '@/components/ImageContainer/index';
import isEmpty from '@/helpers/isEmpty';
import Table from '@/components/Table/index';
import ActionButton from '@/components/ActionButton/index';
import { useModal } from '@/hooks/useModal';

function AdminConfiguracoesPerfilEdit() {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const inputGalleryRef = useRef(null);

  const router = useRouter();
  const { id } = router.query;

  const { addModal, removeModal } = useModal();
  const [activeStep, setActiveStep] = useState(1);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [maxGallery, setMaxGallery] = useState(20);

  const { data, error, mutate } = useFetch(
    `/users-profiles/find/by/user/${id}`
  );

  const {
    data: dataGallery,
    error: errorGallery,
    mutate: mutateGallery
  } = useFetch(`/profiles-galleries/find/by/user-logged?limit=20&page=1`);

  const handleSubmit = async (d, { reset }, e) => {
    setDisableButton(true);
    (async () => {
      try {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        const profileFormData = new FormData();
        const galleryFormData = new FormData();

        if (
          (e.target.file.files.length > 0 && inputRef.current.error.message) ||
          (e.target.files.files.length > 0 &&
            inputGalleryRef.current.error.message)
        ) {
          setAlert({
            type: 'error',
            message:
              inputRef.current.error.message ||
              inputGalleryRef.current.error.message
          });
        } else {
          if (d?.video_url) profileFormData.append('video_url', d.video_url);
          if (d?.about) profileFormData.append('about', d.about);
          if (e.target.file.files.length > 0)
            profileFormData.append('file', e.target.file.files[0]);

          await ProfilesService.update(data?.id, profileFormData).then(res => {
            if (res.status >= 400 || res?.statusCode) {
              setAlert({ type: 'error', message: errorMessage(res) });
            } else {
              mutate();

              const galleryQtd = e.target.files.files.length;

              if (galleryQtd > 0) {
                for (let i = 0; i < galleryQtd; i++)
                  galleryFormData.append('files', e.target.files.files[i]);

                ProfilesService.createGallery(data?.id, galleryFormData).then(
                  res2 => {
                    if (res2.status !== 201 || res2?.statusCode) {
                      setAlert({ type: 'error', message: errorMessage(res2) });
                    } else {
                      mutateGallery();

                      setAlert({
                        type: 'success',
                        message: 'Perfil alterado com sucesso!'
                      });
                    }
                  }
                );
              } else {
                setAlert({
                  type: 'success',
                  message: 'Perfil alterado com sucesso!'
                });
              }

              setTimeout(() => {
                setDisableButton(false);
              }, 1000);
            }
          });
        }
      } catch (err) {
        setAlert({ type: 'error', message: err.errors[0] });
      }
    })();

    setTimeout(() => {
      setDisableButton(false);
    }, 1000);
  };

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

  useEffect(() => {
    if (dataGallery) setMaxGallery(20 - dataGallery?.items?.length);
  }, [dataGallery]);

  if (error || errorGallery) return <Error error={error || errorGallery} />;

  return (
    <>
      <Head>
        <title>Editar perfil público - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%usuario': data?.users?.name
              }}
              title="Editar Perfil Público"
              description="Aqui, você irá editar o perfil público do usuário em questão."
              isLoading={isEmpty(data)}
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
                    onSubmit={handleSubmit}
                    initialData={{
                      ...data
                    }}
                  >
                    <MultiStep activeStep={activeStep}>
                      <Step label="Perfil" onClick={() => setActiveStep(1)}>
                        {data?.image_url && (
                          <ImageContainer
                            src={data?.image_url}
                            alt="Foto de Perfil atual"
                            label="Foto de Perfil atual"
                            zoom
                          />
                        )}
                        <FileInput
                          ref={inputRef}
                          name="file"
                          label="Selecione uma nova Foto de Perfil"
                          extensions={['.jpg', '.jpeg', '.png', '.gif']}
                          min={0}
                          max={1}
                        />
                        <Input
                          type="text"
                          name="video_url"
                          label="Link do vídeo de introdução no YouTube"
                        />
                        <TextArea name="about" label="Sobre mim" />
                      </Step>
                      <Step label="Galeria" onClick={() => setActiveStep(2)}>
                        {(dataGallery && !loading && (
                          <>
                            {(maxGallery > 0 && (
                              <>
                                <Alert type="info">
                                  Você pode inserir até mais {maxGallery} fotos
                                  para a galeria.
                                </Alert>
                                <FileInput
                                  ref={inputGalleryRef}
                                  name="files"
                                  label={`Selecione novas fotos para sua galeria: (máximo ${maxGallery})`}
                                  extensions={['.jpg', '.jpeg', '.png', '.gif']}
                                  min={0}
                                  max={maxGallery}
                                />
                              </>
                            )) || (
                              <Alert type="error">
                                Você não pode inserir mais fotos, a menos que
                                apague algumas antes.
                              </Alert>
                            )}

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
                      {(activeStep !== 1 && (
                        <div>
                          <Button
                            type="button"
                            onClick={() => setActiveStep(activeStep - 1)}
                          >
                            Voltar
                          </Button>
                        </div>
                      )) || (
                        <div>
                          <Button type="button" onClick={() => router.back()}>
                            Cancelar
                          </Button>
                        </div>
                      )}
                      <div>
                        {activeStep !== 2 && (
                          <Button
                            type="button"
                            onClick={() => setActiveStep(activeStep + 1)}
                            className="primary"
                          >
                            Continuar
                          </Button>
                        )}

                        {activeStep === 2 && (
                          <Button
                            disabled={disableButton}
                            className="primary"
                            type="submit"
                          >
                            Salvar
                          </Button>
                        )}
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

export default privateRoute()(AdminConfiguracoesPerfilEdit);

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import AuthService from '@/services/AuthService';
import { UserAuthAction } from '@/store/modules/User/actions';
import scrollTo from '@/helpers/scrollTo';
import InputFile from '@/components/InputFile/index';

function ConfiguracoesPerfilEdit() {
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const inputRef = useRef(null);
  const inputGalleryRef = useRef(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const { addModal, removeModal } = useModal();
  const [activeStep, setActiveStep] = useState(1);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [maxGallery, setMaxGallery] = useState(20);

  const { data, error, mutate } = useFetch(
    `/users-profiles/find/by/user-logged`
  );

  const {
    data: dataGallery,
    error: errorGallery,
    mutate: mutateGallery
  } = useFetch(`/profiles-galleries/find/by/user-logged?limit=20&page=1`);

  const handleSubmit = async d => {
    setDisableButton(true);
    (async () => {
      try {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        scrollTo(alertRef);

        let success = false;
        const profileFormData = new FormData();
        const galleryFormData = new FormData();

        const inputProfileFile = inputRef.current.getFiles();
        const inputGalleryFiles = inputGalleryRef.current.getFiles();

        if (
          (inputProfileFile.length > 0 && inputRef.current.error.message) ||
          (inputGalleryFiles.length > 0 &&
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
          if (inputProfileFile.length > 0)
            profileFormData.append('file', inputProfileFile[0]);

          await ProfilesService.update(data?.id, profileFormData).then(res => {
            if (res.status >= 400 || res?.statusCode) {
              setAlert({ type: 'error', message: errorMessage(res) });
            } else {
              mutate();

              const userData = {
                ...user,
                profile: {
                  ...user.profile,
                  image_url: res.data.image_url
                }
              };

              AuthService.setUserDataCookie(userData);

              dispatch(
                UserAuthAction({
                  user: userData
                })
              );

              const galleryQtd = inputGalleryFiles.length;

              if (galleryQtd > 0) {
                for (let i = 0; i < galleryQtd; i++)
                  galleryFormData.append('files', inputGalleryFiles[i]);

                ProfilesService.createGallery(data?.id, galleryFormData).then(
                  res2 => {
                    if (res2.status !== 201 || res2?.statusCode) {
                      setAlert({ type: 'error', message: errorMessage(res2) });
                    } else {
                      mutateGallery();

                      success = true;
                    }
                  }
                );
              } else {
                success = true;
              }

              if (success) {
                setAlert({
                  type: 'success',
                  message: 'Perfil alterado com sucesso!'
                });

                setTimeout(() => {
                  router.push(`/configuracoes/perfil`);
                  setDisableButton(false);
                }, 1000);
              }
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
        <title>Editar meu perfil público - Agro9</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title="Editar Perfil Público"
              description="Edite abaixo os dados de seu perfil público."
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message && (
                  <Alert type={alert.type} ref={alertRef}>
                    {alert.message}
                  </Alert>
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
                            alt="Sua Foto de Perfil atual"
                            label="Sua Foto de Perfil atual"
                            zoom
                          />
                        )}
                        <InputFile
                          name="file"
                          ref={inputRef}
                          label="Selecione uma nova Foto de Perfil"
                          min={0}
                          max={1}
                          extensions={['image/*']}
                          useImageEditorOptions={{
                            onlyCrop: true,
                            aspectRatio: 1
                          }}
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
                                  para sua galeria.
                                </Alert>

                                <InputFile
                                  name="files"
                                  ref={inputGalleryRef}
                                  label={`Selecione novas fotos para sua galeria: (máximo ${maxGallery})`}
                                  min={0}
                                  max={maxGallery}
                                  extensions={['image/*']}
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

export default privateRoute()(ConfiguracoesPerfilEdit);

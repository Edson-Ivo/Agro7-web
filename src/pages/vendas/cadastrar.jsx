import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import Skeleton from 'react-loading-skeleton';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';
import { MultiStepForm as MultiStep, Step } from '@/components/Multiform';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import { MapActionGetLatLng } from '@/components/MapApp';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import { Section, SectionHeader, SectionBody } from '@/components/Section';
import { CardContainer } from '@/components/CardContainer';
import { privateRoute } from '@/components/PrivateRoute';
import { Alert } from '@/components/Alert';
import errorMessage from '@/helpers/errorMessage';
import { useFetch } from '@/hooks/useFetch';
import SearchSelect from '@/components/SearchSelect/index';
import Error from '@/components/Error/index';
import isEmpty from '@/helpers/isEmpty';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import SalesService from '@/services/SalesService';
import AddressesService from '@/services/AddressesService';
import Divider from '@/components/Divider/index';
import TextArea from '@/components/TextArea/index';
import scrollTo from '@/helpers/scrollTo';
import { useModal } from '@/hooks/useModal';
import usersTypes from '@/helpers/usersTypes';

function VendasCreate() {
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [disableButton, setDisableButton] = useState(false);

  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadingDistributor, setLoadingDistributor] = useState(false);
  const [loadingTransporter, setLoadingTransporter] = useState(false);
  const [loadingTransporterVehicle, setLoadingTransporterVehicle] = useState(
    false
  );

  const [activeStep, setActiveStep] = useState(1);
  const [property, setProperty] = useState('');
  const [product, setProduct] = useState('');
  const [typeUnt, setTypeUnt] = useState('');
  const [isGreen, setIsGreen] = useState('');
  const [distributor, setDistributor] = useState('');
  const [transporter, setTransporter] = useState('');
  const [transporterVehicle, setTransporterVehicle] = useState('');
  const [transporterVehiclesOptions, setTransporterVehiclesOptions] = useState(
    []
  );
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [getStock, setGetStock] = useState(false);
  const [stockQtd, setStockQtd] = useState(0);

  const { data: dataType } = useFetch('/harvests/find/all/types');
  const { data: dataTypeDimension } = useFetch(
    '/properties/find/all/types-dimension'
  );
  const { data: dataStock, error: errorStock } = useFetch(
    getStock
      ? `/harvests/find/by/product/${product}/in-stock/user-logged/property/${property}?type=${typeUnt}&is_green=${isGreen}&limit=1000`
      : null
  );

  const { addModal, removeModal } = useModal();

  const router = useRouter();

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setDisableButton(false);
    setActiveStep(1);
    setLoadingAddresses(false);
    setLoadingDistributor(false);
    setLoadingTransporter(false);
    setLoadingTransporterVehicle(false);
  }, []);

  const handleChangeProperty = e => {
    formRef.current.clearField('products.id');
    formRef.current.clearField('products.quantity');
    formRef.current.clearField('products.type_unity');
    formRef.current.clearField('products.is_green');

    setGetStock(false);

    setProperty(e?.value);
  };

  const handleChangeProduct = e => {
    formRef.current.clearField('products.quantity');
    formRef.current.clearField('products.type_unity');
    formRef.current.clearField('products.is_green');

    setGetStock(false);

    setProduct(e?.value);
  };

  const handleChangeTypeUnt = e => setTypeUnt(e?.value);

  const handleChangeIsGreen = e => setIsGreen(String(Number(e?.value)));

  const handleChangeActiveStep = step => {
    if (step === 2 && property && product && typeUnt && isGreen && !getStock)
      setGetStock(true);

    setActiveStep(step);
  };

  const handleLatLng = ([lat, lng]) => {
    formRef.current.setFieldValue('distributors.latitude', lat);
    formRef.current.setFieldValue('distributors.longitude', lng);
  };

  const handleClearTransporterVechicle = () => {
    formRef.current.clearField('transporter_selector_vehicle');
    formRef.current.clearField('transporters.vehicles.name');
    formRef.current.clearField('transporters.vehicles.plate');
    formRef.current.clearField('transporters.vehicles.description');
  };

  const handleSelectDistributor = e => {
    const id = e?.value;

    if (id && distributor !== id) {
      setLoadingDistributor(true);
      setDistributor(id);

      SalesService.getDistributor(id).then(({ data: dataDistributor }) => {
        if (!isEmpty(dataDistributor)) {
          let d = dataDistributor;
          const { coordinates, addresses } = d;

          ['id', 'created_at', 'updated_at'].forEach(x => {
            delete coordinates[x];
            delete addresses[x];
          });

          delete d.coordinates;
          delete d.addresses;

          d = { ...coordinates, ...addresses, ...d };

          setLatitude(d.latitude);
          setLongitude(d.longitude);

          Object.keys(d).forEach(el => {
            formRef.current.setFieldValue(`distributors.${el}`, d[el]);
          });

          formRef.current.setFieldValue('distributors.type_dimension', {
            value: d.type_dimension,
            label: d.type_dimension
          });
        }

        setLoadingDistributor(false);
      });
    }
  };

  const handleSelectTransporter = e => {
    const id = e?.value;

    if (id && transporter !== id) {
      setLoadingTransporter(true);
      setTransporter(id);

      handleClearTransporterVechicle();

      SalesService.getTransporter(id).then(({ data: dataTransporter }) => {
        if (!isEmpty(dataTransporter)) {
          const d = dataTransporter;
          const { vehicles } = d;

          Object.keys(d).forEach(el => {
            formRef.current.setFieldValue(`transporters.${el}`, d[el]);
          });

          const vehiclesOptions = [];
          Object.keys(vehicles).forEach(el => {
            const { name, plate, id: vId } = vehicles[el];

            vehiclesOptions.push({
              value: vId,
              label: `${name} - ${plate}`
            });
          });

          setTransporterVehiclesOptions(vehiclesOptions);
        }

        setLoadingTransporter(false);
      });
    }
  };

  const handleSelectTransporterVehicle = e => {
    const id = e?.value;

    if (id && transporterVehicle !== id) {
      setLoadingTransporterVehicle(true);
      setTransporterVehicle(id);

      SalesService.getTransporterVehicle(id).then(
        ({ data: dataTransporterVehicle }) => {
          if (!isEmpty(dataTransporterVehicle)) {
            const d = dataTransporterVehicle;

            Object.keys(d).forEach(el => {
              formRef.current.setFieldValue(
                `transporters.vehicles.${el}`,
                d[el]
              );
            });
          }

          setLoadingTransporterVehicle(false);
        }
      );
    }
  };

  const handleChangeLatitude = e => {
    const { value } = e.target;

    setLatitude(Number(value));
  };

  const handleChangeLongitude = e => {
    const { value } = e.target;

    setLongitude(Number(value));
  };

  const handleChangeCep = e => {
    const { value } = e.target;
    if (value.length === 9) {
      setLoadingAddresses(true);

      AddressesService.getCep(value.replace('-', '')).then(
        ({ data: dataAddressCep }) => {
          if (!isEmpty(dataAddressCep)) {
            const {
              state = '',
              city = '',
              neighborhood = '',
              street = ''
            } = dataAddressCep;

            formRef.current.setFieldValue('distributors.state', state);
            formRef.current.setFieldValue('distributors.city', city);
            formRef.current.setFieldValue(
              'distributors.neighborhood',
              neighborhood
            );
            formRef.current.setFieldValue('distributors.street', street);
          }

          setLoadingAddresses(false);
        }
      );
    }
  };

  const handleSubmit = async dt => {
    setDisableButton(true);

    SalesService.schema(stockQtd)
      .validate(dt)
      .then(async d => {
        setAlert({
          type: 'success',
          message: 'Enviando...'
        });

        scrollTo(alertRef);

        if (!product) {
          setAlert({
            type: 'error',
            message: 'O produto deve ser selecionado'
          });
        } else {
          d.products.id = product;
          d.distributors.type_document = !(
            d.distributors.document.length <= 14
          );
          d.transporters.type_document = !(
            d.transporters.document.length <= 14
          );

          handleConfirmCreateSale(d);
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
  };

  const handleCreateSale = async d => {
    removeModal();

    await SalesService.create(d).then(res => {
      if (res.status !== 201 || res?.statusCode) {
        setAlert({ type: 'error', message: errorMessage(res) });
        setTimeout(() => {
          setDisableButton(false);
        }, 1000);
      } else {
        const transporterId = res.data.vehicles_sales.vehicles.transporters.id;
        const transporterFiles =
          res.data.vehicles_sales.vehicles.transporters.documents_files;

        setAlert({
          type: 'success',
          message: 'Venda cadastrada com sucesso!'
        });

        setTimeout(() => {
          if (!transporter && transporterFiles?.length === 0) {
            router.replace(
              `/vendas/transportadoras/${transporterId}/documentos/cadastrar?createSale=${res.data.id}`
            );
          } else {
            router.push(`/vendas/${res.data.id}/detalhes`);
          }
          setDisableButton(false);
        }, 1000);
      }
    });
  };

  const handleConfirmCreateSale = useCallback(
    d => {
      addModal({
        title: 'Cadastrar nova Venda?',
        text:
          'Antes de confirmar o cadastro dessa venda, verifique se todos os dados da venda, transportadora e distribuidora foram inseridos corretamente, pois não poderão ser editados.',
        confirm: true,
        onConfirm: () => handleCreateSale(d),
        onCancel: () => handleCancelModal(removeModal)
      });
    },
    [addModal, removeModal]
  );

  const handleCancelModal = removeModalAction => {
    setDisableButton(false);
    setAlert({
      type: 'info',
      message:
        'Você está revisando os dados... Após revisar, clique em Cadastrar Venda novamente e selecione "sim" para cadastrar essa venda.'
    });
    removeModalAction();
  };

  useEffect(() => {
    if (
      getStock &&
      property &&
      product &&
      typeUnt &&
      isGreen &&
      !isEmpty(dataStock)
    )
      setStockQtd(
        Object.values(dataStock.items).reduce(
          (acc, { stocks: { quantity } }) => acc + quantity,
          0
        )
      );
  }, [getStock, dataStock]);

  if (errorStock) return <Error error={errorStock} />;

  return (
    <>
      <Head>
        <title>Cadastrar Venda - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              title="Nova Venda"
              description="Aqui, você irá cadastrar uma nova venda de um produto."
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              <CardContainer>
                {alert.message !== '' && (
                  <Alert type={alert.type} ref={alertRef}>
                    {alert.message}
                  </Alert>
                )}

                <>
                  <Form ref={formRef} method="post" onSubmit={handleSubmit}>
                    <MultiStep activeStep={activeStep}>
                      <Step
                        label="Produto"
                        onClick={() => handleChangeActiveStep(1)}
                      >
                        {!property && (
                          <Alert type="info">
                            Selecione a propriedade primeiro.
                          </Alert>
                        )}
                        <SearchSelect
                          name="properties"
                          options
                          label="Selecione a propriedade:"
                          onChange={handleChangeProperty}
                          url="/properties/find/by/user-logged"
                        />

                        {(property && (
                          <SearchSelect
                            name="products.id"
                            options
                            label="Selecione o produto (produtos em estoque):"
                            onChange={handleChangeProduct}
                            url={`/products/find/in-stock/by/user-logged/property/${property}`}
                          />
                        )) || (
                          <Select
                            options={[]}
                            label="Selecione o produto (produtos em estoque):"
                            name="products.id"
                            disabled
                          />
                        )}
                        <div className="form-group">
                          <div>
                            <Select
                              options={dataType?.typesHarvest.map(
                                typeHarvest => ({
                                  value: typeHarvest,
                                  label: typeHarvest
                                })
                              )}
                              onChange={handleChangeTypeUnt}
                              label="Unidade de medida"
                              name="products.type_unity"
                              disabled={!property}
                            />
                          </div>

                          <div>
                            <Select
                              options={[
                                {
                                  value: true,
                                  label: 'Sim'
                                },
                                {
                                  value: false,
                                  label: 'Não'
                                }
                              ]}
                              onChange={handleChangeIsGreen}
                              label="O produto está verde?"
                              name="products.is_green"
                              disabled={!property}
                            />
                          </div>
                        </div>
                      </Step>
                      <Step
                        label="Venda"
                        onClick={() => handleChangeActiveStep(2)}
                      >
                        {(getStock && (
                          <>
                            {(dataStock && (
                              <>
                                <div
                                  style={{ marginBottom: 15, marginLeft: 10 }}
                                >
                                  <h4>
                                    Quantidade em Estoque: {stockQtd}
                                    {typeUnt}
                                  </h4>
                                </div>
                              </>
                            )) || (
                              <Skeleton
                                style={{
                                  maxWidth: '40%',
                                  minHeight: '22px',
                                  marginBottom: '15px'
                                }}
                              />
                            )}
                          </>
                        )) || (
                          <Alert type="error">
                            Selecione o produto e suas informações antes.
                          </Alert>
                        )}
                        <Input
                          type="number"
                          label="Quantidade da venda"
                          name="products.quantity"
                          min="1"
                          disabled={!getStock}
                        />
                        <Input
                          type="text"
                          label="Preço em R$ da venda"
                          name="value"
                          inputMode="numeric"
                          mask="money"
                          disabled={!getStock}
                        />
                      </Step>
                      <Step
                        label="Distribuição"
                        onClick={() => handleChangeActiveStep(3)}
                      >
                        {loadingDistributor && (
                          <Alert type="success">
                            Estamos carregando os dados da distribuidora
                            selecionada, aguarde...
                          </Alert>
                        )}

                        <div style={{ marginBottom: 10 }}>
                          <h4>Selecione uma distribuidora:</h4>
                        </div>

                        <SearchSelect
                          name="distributors_selector"
                          options
                          label="Distribuidoras já cadastradas:"
                          onChange={handleSelectDistributor}
                          disabled={loadingDistributor}
                          url="/distributors/find/by/user-logged"
                        />

                        <Divider>Ou</Divider>

                        <div style={{ marginBottom: 10 }}>
                          <h4>Cadastre uma nova distribuidora:</h4>
                        </div>

                        <Input
                          type="text"
                          label="Nome"
                          name="distributors.name"
                        />
                        <Input
                          type="text"
                          label="Documento (CPF ou CNPJ)"
                          name="distributors.document"
                          mask="cpf_cnpj"
                          maxLength="18"
                        />
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              label="Área"
                              name="distributors.area"
                            />
                          </div>
                          <div>
                            <Select
                              options={dataTypeDimension?.typesDimension.map(
                                dimension => ({
                                  value: dimension,
                                  label: dimension
                                })
                              )}
                              label="Unidade de medida"
                              name="distributors.type_dimension"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="text"
                              label="CEP"
                              name="distributors.postcode"
                              initialValue=""
                              mask="cep"
                              disabled={loadingAddresses}
                              handleChange={handleChangeCep}
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              label="Estado"
                              name="distributors.state"
                              initialValue=""
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="text"
                              label="Cidade"
                              name="distributors.city"
                              initialValue=""
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              label="Bairro"
                              name="distributors.neighborhood"
                              initialValue=""
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="text"
                              label="Rua"
                              name="distributors.street"
                              initialValue=""
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              label="Número"
                              name="distributors.number"
                              initialValue=""
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div>
                            <Input
                              type="number"
                              label="Latitude"
                              handleChange={handleChangeLatitude}
                              name="distributors.latitude"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              label="Longitude"
                              handleChange={handleChangeLongitude}
                              name="distributors.longitude"
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                          <MapActionGetLatLng
                            onClick={handleLatLng}
                            latitude={latitude}
                            longitude={longitude}
                          />
                        </div>
                      </Step>
                      <Step
                        label="Transporte"
                        onClick={() => handleChangeActiveStep(4)}
                      >
                        <div style={{ marginBottom: 10 }}>
                          <h4>
                            Selecione uma transportadora e o veículo utilizado:
                          </h4>
                        </div>

                        {(loadingTransporter || loadingTransporterVehicle) && (
                          <Alert type="success">
                            Estamos carregando os dados da transportadora
                            selecionada, aguarde...
                          </Alert>
                        )}

                        <SearchSelect
                          name="transporter_selector"
                          options
                          label="Transportadoras já cadastradas:"
                          onChange={handleSelectTransporter}
                          disabled={loadingTransporter}
                          url="/transporters/find/by/user-logged"
                        />

                        {transporter && (
                          <Alert type="info">
                            Selecione essa opção somente se quiser utilizar um
                            veículo já cadastrado.
                          </Alert>
                        )}

                        <Select
                          options={transporterVehiclesOptions}
                          onChange={handleSelectTransporterVehicle}
                          label="Veículos da transportadora:"
                          name="transporter_selector_vehicle"
                          disabled={!transporter || loadingTransporterVehicle}
                        />

                        <Divider>Ou</Divider>

                        <div style={{ marginBottom: 10 }}>
                          <h4>Cadastre uma nova transportadora:</h4>
                        </div>

                        <Input
                          type="text"
                          label="Nome"
                          name="transporters.name"
                        />
                        <Input
                          type="text"
                          label="Documento (CPF ou CNPJ)"
                          name="transporters.document"
                          mask="cpf_cnpj"
                          maxLength="18"
                        />
                        <Input
                          type="text"
                          label="Número Telefone"
                          name="transporters.phone"
                          mask="phone"
                          maxLength={15}
                        />
                        {transporter && !transporterVehicle && (
                          <div style={{ marginBottom: 10 }}>
                            <h4>
                              Cadastre um novo veículo para essa transportadora:
                            </h4>
                          </div>
                        )}
                        <div className="form-group">
                          <div>
                            <Input
                              type="text"
                              label="Nome do veículo"
                              name="transporters.vehicles.name"
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              label="Placa do veículo"
                              name="transporters.vehicles.plate"
                              mask="plate"
                            />
                          </div>
                        </div>
                        <TextArea
                          name="transporters.vehicles.description"
                          label="Descrição do veículo"
                        />
                      </Step>
                    </MultiStep>

                    <div className="form-group buttons">
                      {(activeStep !== 1 && (
                        <div>
                          <Button
                            type="button"
                            onClick={() =>
                              handleChangeActiveStep(activeStep - 1)
                            }
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
                        {activeStep !== 4 && (
                          <Button
                            type="button"
                            onClick={() =>
                              handleChangeActiveStep(activeStep + 1)
                            }
                            className="primary"
                          >
                            Continuar
                          </Button>
                        )}

                        {activeStep === 4 && (
                          <Button
                            disabled={disableButton}
                            className="primary"
                            type="submit"
                          >
                            Cadastrar Venda
                          </Button>
                        )}
                      </div>
                    </div>
                  </Form>
                </>
              </CardContainer>
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute([
  usersTypes[0],
  usersTypes[1],
  usersTypes[2],
  usersTypes[4]
])(VendasCreate);

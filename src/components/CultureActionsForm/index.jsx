import React, { useEffect, useState } from 'react';

import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import SearchSelect from '@/components/SearchSelect';
import Select from '@/components/Select';
import { Alert } from '@/components/Alert';
import Loader from '@/components/Loader';

import { useFetch } from '@/hooks/useFetch';
import isEmpty from '@/helpers/isEmpty';

const CulturesActionsForm = ({
  typeAction,
  idCulture,
  dataAction = null,
  editForm = false,
  details = false
}) => {
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const { data: dataTypes, error: errorTypes } = useFetch(
    '/cultures-applications-supplies/find/all/types-dose'
  );

  useEffect(() => {
    if (details) setDisabled(true);
    setTimeout(() => setLoading(false), 250);
  }, []);

  if (errorTypes)
    return (
      <Alert type="error">
        Não foi possível carregar, tente novamente mais tarde
      </Alert>
    );

  if (loading) return <Loader />;

  return (
    (['services', 'supplies'].includes(typeAction) && (
      <>
        <div className="form-group">
          <div>
            <Input
              type="text"
              label="Nome"
              name="name"
              required
              disabled={disabled}
            />
          </div>
          <div>
            <Input
              type="text"
              label="Preço em R$"
              name="value"
              inputMode="numeric"
              mask="money"
              required
              disabled={disabled}
            />
          </div>
        </div>
        <TextArea
          name="description"
          label="Descrição"
          required
          disabled={disabled}
        />
      </>
    )) ||
    (typeAction === 'irrigations' && (
      <>
        <div className="form-group">
          <div>
            <Input
              type="date"
              label="Data Inicial"
              name="date_start"
              required
              disabled={disabled}
            />
          </div>
          <div>
            <Input
              type="time"
              label="Hora Inicial"
              name="time_start"
              required
              disabled={disabled}
            />
          </div>
        </div>
        <div className="form-group">
          <div>
            <Input
              type="date"
              label="Data Final"
              name="date_finish"
              required
              disabled={disabled}
            />
          </div>
          <div>
            <Input
              type="time"
              label="Hora Final"
              name="time_finish"
              required
              disabled={disabled}
            />
          </div>
        </div>
      </>
    )) ||
    (typeAction === 'others' && (
      <>
        <Input
          type="text"
          label="Nome"
          name="name"
          required
          disabled={disabled}
        />
        <TextArea
          name="description"
          label="Descrição"
          required
          disabled={disabled}
        />
      </>
    )) ||
    (typeAction === 'applications-supplies' &&
      !isEmpty(dataTypes) &&
      !isEmpty(dataAction) && (
        <>
          {!editForm && !details ? (
            <SearchSelect
              name="supplies"
              label="Digite o nome do Insumo:"
              url={`/cultures-supplies/find/by/culture/${idCulture}`}
              required
              disabled={disabled}
            />
          ) : (
            <>
              <Select
                name="supplies"
                label="Insumo:"
                options={[
                  {
                    value: dataAction?.supplies?.id,
                    label: dataAction?.supplies?.name
                  }
                ]}
                disabled
              />
            </>
          )}

          <div className="form-group">
            <div>
              <Input
                type="number"
                label="Dosagem"
                name="dose"
                required
                disabled={disabled}
              />
            </div>
            <div>
              <Select
                options={dataTypes?.typesDose.map(typeDose => ({
                  value: typeDose,
                  label: typeDose
                }))}
                label="Unidade de Dosagem"
                name="type_dose"
                disabled={disabled}
              />
            </div>
          </div>
          <div className="form-group">
            <div>
              <Input
                type="date"
                label="Data Inicial"
                name="date_start"
                required
                disabled={disabled}
              />
            </div>
            <div>
              <Input
                type="date"
                label="Data Final"
                name="date_finish"
                required
                disabled={disabled}
              />
            </div>
          </div>
        </>
      ))
  );
};

export default CulturesActionsForm;

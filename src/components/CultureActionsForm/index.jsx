import React, { useEffect, useState } from 'react';

import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import SearchSelect from '@/components/SearchSelect';
import Select from '@/components/Select';
import { Alert } from '@/components/Alert';
import Loader from '@/components/Loader';

import { useFetch } from '@/hooks/useFetch';
import isEmpty from '@/helpers/isEmpty';
import { dateToInput, removeTimeSeconds } from '@/helpers/date';

const CulturesActionsForm = ({
  typeAction,
  idCulture,
  dataAction = null,
  editForm = false,
  details = false
}) => {
  const [state, setState] = useState({
    name: '',
    value: '',
    description: '',
    date_start: '',
    time_start: '',
    date_finish: '',
    time_finish: '',
    supplies: '',
    dose: '',
    type_dose: ''
  });

  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [suppliesSelectOptions, setSuppliesSelectOptions] = useState([]);

  const { data: dataTypes, error: errorTypes } = useFetch(
    '/cultures-applications-supplies/find/all/types-dose'
  );

  const handleChange = e => {
    const { value } = e.target;

    setState({
      ...state,
      [e.target.name]: value
    });
  };

  useEffect(() => {
    if (editForm || details) {
      const handleState = state;

      Object.keys(handleState).forEach(field => {
        let el = dataAction?.[field];

        if (!isEmpty(el)) {
          if (['date_start', 'date_finish'].includes(field))
            el = dateToInput(el);

          if (['time_start', 'time_finish'].includes(field))
            el = removeTimeSeconds(el);

          if (field === 'supplies') {
            const supplyId = Number(el?.id);

            setSuppliesSelectOptions([
              {
                value: supplyId,
                label: el?.name
              }
            ]);

            el = supplyId;
          }

          setState(prevState => ({
            ...prevState,
            [field]: el
          }));
        }
      });
    }

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
              initialValue={state.name}
              value={state.name}
              handleChange={handleChange}
              required
              disabled={disabled}
            />
          </div>
          <div>
            <Input
              type="text"
              label="Preço em R$"
              name="value"
              mask="money"
              initialValue={state.value}
              value={state.value}
              handleChange={handleChange}
              required
              disabled={disabled}
            />
          </div>
        </div>
        <TextArea
          name="description"
          label="Descrição"
          initialValue={state.description}
          value={state.description}
          handleChange={handleChange}
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
              initialValue={state.date_start}
              value={state.date_start}
              handleChange={handleChange}
              required
              disabled={disabled}
            />
          </div>
          <div>
            <Input
              type="time"
              label="Hora Inicial"
              name="time_start"
              initialValue={state.time_start}
              value={state.time_start}
              handleChange={handleChange}
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
              initialValue={state.date_finish}
              value={state.date_finish}
              handleChange={handleChange}
              required
              disabled={disabled}
            />
          </div>
          <div>
            <Input
              type="time"
              label="Hora Final"
              name="time_finish"
              initialValue={state.time_finish}
              value={state.time_finish}
              handleChange={handleChange}
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
          initialValue={state.name}
          value={state.name}
          handleChange={handleChange}
          required
          disabled={disabled}
        />
        <TextArea
          name="description"
          label="Descrição"
          initialValue={state.description}
          value={state.description}
          handleChange={handleChange}
          required
          disabled={disabled}
        />
      </>
    )) ||
    (typeAction === 'applications-supplies' && !isEmpty(dataTypes) && (
      <>
        {!editForm && !details ? (
          <SearchSelect
            name="supplies"
            label="Digite o nome do Insumo:"
            url={`/cultures-supplies/find/by/culture/${idCulture}`}
            value={state.supplies}
            initialValue={state.supplies}
            handleChange={handleChange}
            options={suppliesSelectOptions}
            required
            disabled={disabled}
          />
        ) : (
          <Select
            name="supplies"
            label="Insumo:"
            value={state.supplies}
            initialValue={state.supplies}
            handleChange={handleChange}
            options={suppliesSelectOptions}
            required
            disabled
          />
        )}

        <div className="form-group">
          <div>
            <Input
              type="number"
              label="Dosagem"
              name="dose"
              initialValue={state.dose}
              value={state.dose}
              handleChange={handleChange}
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
              value={state.type_dose}
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
              initialValue={state.date_start}
              value={state.date_start}
              handleChange={handleChange}
              required
              disabled={disabled}
            />
          </div>
          <div>
            <Input
              type="date"
              label="Data Final"
              name="date_finish"
              initialValue={state.date_finish}
              value={state.date_finish}
              handleChange={handleChange}
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

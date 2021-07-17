import * as yup from 'yup';

import { dateConversor } from '@/helpers/date';
import { api } from './api';

class CulturesActionsService {
  static text(action, data) {
    let txt = actionsList[action].text;

    if (['services', 'supplies'].includes(action))
      txt = txt.replace('%name', data?.name).replace('%value', data?.value);

    if (action === 'others') {
      txt = txt.replace('%name', data?.name);

      if (data?.value) txt += `, custando R$ ${data?.value}`;

      txt += '.';
    }

    if (action === 'irrigations')
      txt = txt
        .replace('%date_start', dateConversor(data?.date_start, false))
        .replace('%time_start', data?.time_start)
        .replace('%date_finish', dateConversor(data?.date_finish, false))
        .replace('%time_finish', data?.time_finish);

    if (action === 'applications-supplies')
      txt = txt
        .replace('%name', data?.supplies?.name)
        .replace('%dose', data?.dose)
        .replace('%type_dose', data?.type_dose)
        .replace('%date_start', dateConversor(data?.date_start, false))
        .replace('%date_finish', dateConversor(data?.date_finish, false));

    return txt;
  }

  static schema(action) {
    let schema = null;

    if (action === 'services' || action === 'supplies')
      schema = yup.object().shape({
        name: yup.string().required('O campo nome é obrigatório!'),
        description: yup.string().required('O campo descrição é obrigatório!'),
        value: yup
          .number()
          .transform(value => (Number.isNaN(value) ? undefined : value))
          .required('O campo preço é obrigatório!')
      });

    if (action === 'irrigations')
      schema = yup.object().shape({
        date_start: yup
          .string()
          .required('O campo data inicial é obrigatório!'),
        date_finish: yup.string().required('O campo data final é obrigatório!'),
        time_start: yup
          .string()
          .required('O campo hora inicial é obrigatório!'),
        time_finish: yup.string().required('O campo hora final é obrigatório!')
      });

    if (action === 'applications-supplies')
      schema = yup.object().shape({
        date_start: yup
          .string()
          .required('O campo data inicial é obrigatório!'),
        date_finish: yup.string().required('O campo data final é obrigatório!'),
        dose: yup
          .number()
          .transform(value => (Number.isNaN(value) ? undefined : value))
          .positive('O campo dosagem deve ser um valor positivo')
          .required('O campo dosagem é obrigatório!'),
        type_dose: yup
          .string()
          .required('Unidade de dosagem precisa ser definida'),
        supplies: yup
          .number()
          .transform(value => (Number.isNaN(value) ? undefined : value))
          .required('O insumo precisa ser selecionado.')
      });

    if (action === 'others')
      schema = yup.object().shape({
        name: yup.string().required('O campo nome é obrigatório!'),
        description: yup.string().required('O campo descrição é obrigatório!'),
        value: yup
          .number()
          .transform(value => (Number.isNaN(value) ? undefined : value))
      });

    return schema;
  }

  static async create(data, action) {
    try {
      const response = await api.post(`/cultures-${action}/create`, {
        ...data
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(id, data, action) {
    try {
      const response = await api.put(`/cultures-${action}/update/${id}`, {
        ...data
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id, action) {
    try {
      const response = await api.delete(`/cultures-${action}/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export const actionsList = {
  services: {
    value: 'services',
    label: 'Serviços',
    text: 'Serviço %name, custando R$ %value, feito.'
  },
  irrigations: {
    value: 'irrigations',
    label: 'Irrigações',
    text:
      'Irrigação feita em %date_start às %time_start até %date_finish às %time_finish.'
  },
  supplies: {
    value: 'supplies',
    label: 'Insumos',
    text: 'Insumo %name, custando R$ %value, adicionado.'
  },
  'applications-supplies': {
    value: 'applications-supplies',
    label: 'Aplicação de Insumos',
    text:
      'Insumo %name aplicado (%dose%type_dose) em %date_start até %date_finish.'
  },
  others: {
    value: 'others',
    label: 'Outros',
    text: '%name foi realizado'
  }
};

export default CulturesActionsService;

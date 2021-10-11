import * as yup from 'yup';

import maskString from '@/helpers/maskString';
import { dateConversor } from '@/helpers/date';
import { api } from './api';

class CulturesActionsService {
  static text(action, data) {
    let txt = actionsList[action].text;

    if (
      action === 'services' ||
      action === 'durable-goods' ||
      action === 'consumable-goods'
    ) {
      txt = txt
        .replace('%name', data?.name)
        .replace('%value', maskString(data?.value, 'money'));

      if (data?.date) txt += ` no dia ${dateConversor(data?.date, false)}`;

      txt += '.';
    }

    if (action === 'supplies') txt = txt.replace('%name', data?.name);

    if (action === 'others') {
      txt = txt.replace('%name', data?.name);

      if (data?.value) txt += `, custando ${maskString(data?.value, 'money')}`;
      if (data?.date) txt += `, no dia ${dateConversor(data?.date, false)}`;

      txt += '.';
    }

    if (action === 'irrigations')
      txt = txt
        .replace('%date_start', dateConversor(data?.date_start, false))
        .replace('%time_start', data?.time_start)
        .replace('%date_finish', dateConversor(data?.date_finish, false))
        .replace('%time_finish', data?.time_finish);

    if (action === 'applications-supplies') {
      txt = txt
        .replace('%name', data?.supplies?.name)
        .replace('%dose', data?.dose)
        .replace('%type_dose', data?.type_dose)
        .replace('%date_start', dateConversor(data?.date_start, false))
        .replace('%date_finish', dateConversor(data?.date_finish, false));

      if (data?.value) txt += `, custando ${maskString(data?.value, 'money')}`;

      txt += '.';
    }

    return txt;
  }

  static schema(action) {
    let schema = null;

    if (
      action === 'services' ||
      action === 'durable-goods' ||
      action === 'consumable-goods'
    )
      schema = yup.object().shape({
        name: yup.string().required('O campo nome é obrigatório!'),
        description: yup.string().required('O campo descrição é obrigatório!'),
        value: yup
          .number()
          .transform(value => (Number.isNaN(value) ? undefined : value))
          .required('O campo preço é obrigatório!'),
        date: yup.string().nullable()
      });

    if (action === 'supplies')
      schema = yup.object().shape({
        name: yup.string().required('O campo nome é obrigatório!'),
        description: yup.string().required('O campo descrição é obrigatório!')
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
          .required('O insumo precisa ser selecionado.'),
        value: yup
          .number()
          .transform(value => (Number.isNaN(value) ? undefined : value)),
        plant_health_control: yup
          .string()
          .max(
            500,
            'O campo controle de fitossanidade não deve ultrapassar 500 caracteres!'
          )
          .required('O campo controle de fitossanidade é obrigatório!')
      });

    if (action === 'others')
      schema = yup.object().shape({
        name: yup.string().required('O campo nome é obrigatório!'),
        description: yup.string().required('O campo descrição é obrigatório!'),
        value: yup
          .number()
          .transform(value => (Number.isNaN(value) ? undefined : value)),
        date: yup.string().nullable()
      });

    return schema;
  }

  static async create(data, action, userId = null) {
    try {
      let response;

      if (!userId) {
        response = await api.post(`/cultures-${action}/create`, {
          ...data
        });
      } else {
        response = await api.post(`/cultures-${action}/create/user/${userId}`, {
          ...data
        });
      }

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

  static async createDocument(id, data, action) {
    try {
      const response = await api.post(
        `/cultures-${action}-documents/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async updateDocument(id, data, action) {
    try {
      const response = await api.put(
        `/cultures-${action}-documents/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async deleteDocument(id, action) {
    try {
      const response = await api.delete(`/cultures-${action}-documents/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export const actionsList = {
  services: {
    value: 'services',
    singleValue: 'service',
    label: 'Serviços',
    text: 'Serviço %name, custando %value, feito'
  },
  irrigations: {
    value: 'irrigations',
    singleValue: 'irrigation',
    label: 'Irrigações',
    text:
      'Irrigação feita em %date_start às %time_start até %date_finish às %time_finish.'
  },
  supplies: {
    value: 'supplies',
    singleValue: 'supply',
    label: 'Insumos',
    text: 'Insumo %name foi adicionado.'
  },
  'applications-supplies': {
    value: 'applications-supplies',
    singleValue: 'application-supply',
    label: 'Aplicação de Insumos',
    text:
      'Insumo %name aplicado (%dose%type_dose) em %date_start até %date_finish'
  },
  'durable-goods': {
    value: 'durable-goods',
    singleValue: 'durable-good',
    label: 'Bens Duráveis',
    text: 'Bem durável %name registrado'
  },
  'consumable-goods': {
    value: 'consumable-goods',
    singleValue: 'consumable-good',
    label: 'Bens Consumíveis',
    text: 'Bem consumível %name registrado'
  },
  others: {
    value: 'others',
    singleValue: 'other',
    label: 'Outros',
    text: '%name foi realizado'
  }
};

export default CulturesActionsService;

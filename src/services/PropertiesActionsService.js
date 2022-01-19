import * as yup from 'yup';

import maskString from '@/helpers/maskString';
import { dateConversor } from '@/helpers/date';
import { api } from './api';

class PropertiesActionsService {
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

    if (action === 'rains')
      txt = txt
        .replace('%date', dateConversor(data?.date, false))
        .replace('%quantity', `${data?.quantity}mm`);

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

    if (action === 'others')
      schema = yup.object().shape({
        name: yup.string().required('O campo nome é obrigatório!'),
        description: yup.string().required('O campo descrição é obrigatório!'),
        value: yup
          .number()
          .transform(value => (Number.isNaN(value) ? undefined : value)),
        date: yup.string().nullable()
      });

    if (action === 'rains')
      schema = yup.object().shape({
        date: yup.string().required('O campo data é obrigatório!'),
        quantity: yup
          .number()
          .transform(value => (Number.isNaN(value) ? undefined : value))
      });

    return schema;
  }

  static requestAction(action) {
    return action === 'supplies' ? 'supplies' : `properties-${action}`;
  }

  static requestSingleAction(action) {
    return action === 'supplies'
      ? actionsList?.supplies?.singleValue
      : `property-${actionsList?.[action]?.singleValue}`;
  }

  static async create(data, action, userId = null) {
    try {
      let response;

      if (!userId) {
        response = await api.post(`/properties-${action}/create`, {
          ...data
        });
      } else {
        response = await api.post(
          `/properties-${action}/create/user/${userId}`,
          {
            ...data
          }
        );
      }

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(id, data, action) {
    try {
      const response = await api.put(`/properties-${action}/update/${id}`, {
        ...data
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id, action) {
    try {
      const response = await api.delete(`/properties-${action}/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async createDocument(id, data, action) {
    try {
      const response = await api.post(
        `/properties-${action}-documents/${id}`,
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
        `/properties-${action}-documents/${id}`,
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
      const response = await api.delete(
        `/properties-${action}-documents/${id}`
      );

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
    text: 'Serviço %name, custando %value, feito',
    documents: true
  },
  'durable-goods': {
    value: 'durable-goods',
    singleValue: 'durable-good',
    label: 'Bens Duráveis',
    text: 'Bem durável %name registrado',
    documents: true
  },
  'consumable-goods': {
    value: 'consumable-goods',
    singleValue: 'consumable-good',
    label: 'Bens Consumíveis',
    text: 'Bem consumível %name registrado',
    documents: true
  },
  irrigations: {
    value: 'irrigations',
    singleValue: 'irrigation',
    label: 'Irrigações',
    text:
      'Irrigação feita em %date_start às %time_start até %date_finish às %time_finish.',
    documents: true
  },
  rains: {
    value: 'rains',
    singleValue: 'rain',
    label: 'Chuvas',
    text: 'Choveu %quantity no dia %date.',
    documents: false
  },
  others: {
    value: 'others',
    singleValue: 'other',
    label: 'Outros',
    text: '%name foi realizado',
    documents: true
  }
};

export default PropertiesActionsService;

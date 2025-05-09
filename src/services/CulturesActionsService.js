import * as yup from 'yup';

import maskString from '@/helpers/maskString';
import { dateConversor } from '@/helpers/date';
import { api } from './api';

class CultureqActionsService {
  static text(action, data) {
    let txt = actionsList[action].text;
    if (action === 'services') {
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

    if (action === 'services')
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

    return schema;
  }

  static requestAction(action) {
    return action === 'supplies' ? 'supplies' : `cultures-${action}`;
  }

  static requestSingleAction(action) {
    return action === 'supplies'
      ? actionsList?.supplies?.singleValue
      : `culture-${actionsList?.[action]?.singleValue}`;
  }

  static async create(data, action, userId = null) {
    const reqAction = this.requestAction(action);

    try {
      let response;

      if (!userId) {
        response = await api.post(`/${reqAction}/create`, {
          ...data
        });
      } else {
        response = await api.post(`/${reqAction}/create/user/${userId}`, {
          ...data
        });
      }

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(id, data, action) {
    const reqAction = this.requestAction(action);

    try {
      const response = await api.put(`/${reqAction}/update/${id}`, {
        ...data
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id, action) {
    const reqAction = this.requestAction(action);

    try {
      const response = await api.delete(`/${reqAction}/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async createDocument(id, data, action) {
    const reqAction = this.requestAction(action);

    try {
      const response = await api.post(`/${reqAction}-documents/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async updateDocument(id, data, action) {
    const reqAction = this.requestAction(action);

    try {
      const response = await api.put(`/${reqAction}-documents/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async deleteDocument(id, action) {
    const reqAction = this.requestAction(action);

    try {
      const response = await api.delete(`/${reqAction}-documents/${id}`);

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
  supplies: {
    value: 'supplies',
    singleValue: 'supply',
    label: 'Insumos',
    text: 'Insumo %name foi adicionado.',
    documents: true
  },
  'applications-supplies': {
    value: 'applications-supplies',
    singleValue: 'application-supply',
    label: 'Aplicação de Insumos',
    text:
      'Insumo %name aplicado (%dose%type_dose) em %date_start até %date_finish',
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
  others: {
    value: 'others',
    singleValue: 'other',
    label: 'Outros',
    text: '%name foi realizado',
    documents: true
  }
};

export default CultureqActionsService;

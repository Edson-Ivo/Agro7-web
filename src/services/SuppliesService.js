import * as yup from 'yup';
import { api } from './api';

export const supplies = {
  value: 'supplies',
  singleValue: 'supply',
  label: 'Insumos',
  text: 'Insumo %name foi adicionado.',
  documents: true
};

class SuppliesService {
  static text(data) {
    return supplies.text.replace('%name', data?.name);
  }

  static schema() {
    const schema = yup.object().shape({
      name: yup.string().required('O campo nome é obrigatório!'),
      description: yup.string().required('O campo descrição é obrigatório!')
    });

    return schema;
  }

  static async create(data, userId = null) {
    const reqAction = 'supplies';

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

  static async update(id, data) {
    const reqAction = 'supplies';

    try {
      const response = await api.put(`/${reqAction}/update/${id}`, {
        ...data
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id) {
    const reqAction = 'supplies';

    try {
      const response = await api.delete(`/${reqAction}/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async createDocument(id, data) {
    const reqAction = 'supplies';

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

  static async updateDocument(id, data) {
    const reqAction = 'supplies';

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

  static async deleteDocument(id) {
    const reqAction = 'supplies';

    try {
      const response = await api.delete(`/${reqAction}-documents/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default SuppliesService;

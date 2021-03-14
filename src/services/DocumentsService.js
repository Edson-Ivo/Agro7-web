import { api } from './api';

class DocumentsService {
  static async findById(id) {
    return api.get(`/documents/find/by/id/${id}`);
  }

  static async findByProperty(idProperty) {
    return api.get(`/documents/find/property/${idProperty}`);
  }

  static async create(idProperty, data) {
    try {
      const response = await api.post(`/documents/${idProperty}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(idProperty, data) {
    try {
      const response = await api.put(`/documents/${idProperty}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/documents/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default DocumentsService;

import { api } from './api';

class DocumentsService {
  static async create(idProperty, data) {
    try {
      const response = await api.post(
        `/properties-documents/${idProperty}`,
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

  static async update(idProperty, data) {
    try {
      const response = await api.put(
        `/properties-documents/${idProperty}`,
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

  static async delete(id) {
    try {
      const response = await api.delete(`/properties-documents/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default DocumentsService;

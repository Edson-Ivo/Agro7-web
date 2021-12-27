import { api } from './api';

class ProducerNotebookService {
  static async create(data) {
    try {
      const response = await api.post(`/producer-notebook/create`, { ...data });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async createAdmin(id, data) {
    try {
      const response = await api.post(`/producer-notebook/create/user/${id}`, {
        ...data
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/producer-notebook/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(id, data) {
    try {
      const response = await api.put(`/producer-notebook/update/${id}`, {
        name: data.name,
        description: data.description,
        date: data.date,
        categories: data.categories
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default ProducerNotebookService;

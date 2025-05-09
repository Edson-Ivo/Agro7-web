import { api } from './api';

class CategoriesService {
  static async create(data) {
    try {
      const response = await api.post(`/categories/create`, { ...data });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/categories/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(id, data) {
    try {
      const response = await api.put(`/categories/update/${id}`, {
        name: data.name,
        description: data.description,
        colors: data.colors
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default CategoriesService;

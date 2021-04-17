import { api } from './api';

class ColorsService {
  static async findAll() {
    return api.get('/colors/find/all');
  }

  static async findById(id) {
    return api.get(`/colors/find/by/id/${id}`);
  }

  static async create(data) {
    try {
      const response = await api.post(`/colors/create`, { ...data });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/colors/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(id, data) {
    try {
      const response = await api.put(`/colors/update/${id}`, {
        name: data.name,
        hexadecimal: data.hexadecimal
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default ColorsService;

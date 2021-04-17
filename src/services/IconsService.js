import { api } from './api';

class IconsService {
  static async findAll() {
    return api.get('/icons/find/all');
  }

  static async findById(id) {
    return api.get(`/icons/find/by/id/${id}`);
  }

  static async create(data) {
    try {
      const response = await api.post(`/icons/create`, data, {
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
      const response = await api.delete(`/icons/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(id, data) {
    try {
      const response = await api.put(`/icons/update/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default IconsService;

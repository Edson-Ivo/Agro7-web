import { api } from './api';

class PropertiesService {
  static async findAll() {
    return api.get('/properties/find/all');
  }

  static async findById(id) {
    return api.get(`/properties/find/by/id/${id}`);
  }

  static async findByUser(userId) {
    return api.get(`/properties/find/by/user/${userId}`);
  }

  static async create(data) {
    try {
      const response = await api.post(`/properties/create`, { ...data });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(id, data) {
    try {
      const response = await api.put(
        `/properties/update/${id}`,
        JSON.stringify({ data })
      );
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default PropertiesService;

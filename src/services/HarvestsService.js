import { api } from './api';

class HarvestsService {
  static async findAll() {
    return api.get('/harvests/find/all');
  }

  static async findById(id) {
    return api.get(`/harvests/find/by/id/${id}`);
  }

  static async findByCulture(cultureId) {
    return api.get(`/harvests/find/by/culture/${cultureId}`);
  }

  static async create(data) {
    try {
      const response = await api.post(`/harvests/create`, { ...data });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/harvests/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default HarvestsService;

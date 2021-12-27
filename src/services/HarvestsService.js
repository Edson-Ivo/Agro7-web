import { api } from './api';

class HarvestsService {
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

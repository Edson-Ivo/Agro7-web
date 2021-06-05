import { api } from './api';

class HarvestsService {
  static async findAll() {
    return api.get('/harvests/find/all');
  }

  static async findById(id) {
    return api.get(`/harvests/find/by/id/${id}`);
  }

  static async findByCulture(idCulture) {
    return api.get(`/harvests/find/by/culture/${idCulture}`);
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

  static async update(id, data) {
    try {
      const response = await api.put(`/harvests/update/${id}`, {
        date: data.date,
        quantity: data.quantity,
        forecast: data.forecast,
        quantity_forecast: data.quantity_forecast
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default HarvestsService;

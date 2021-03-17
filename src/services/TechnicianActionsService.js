import { api } from './api';

class TechnicianActionsService {
  static async findAll() {
    return api.get('/technician-actions/find/all');
  }

  static async findById(id) {
    return api.get(`/technician-actions/find/by/id/${id}`);
  }

  static async findByCulture(idCulture) {
    return api.get(`/technician-actions/find/by/culture/${idCulture}`);
  }

  static async create(data) {
    try {
      const response = await api.post(`/technician-actions/create`, {
        ...data
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/technician-actions/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(id, data) {
    try {
      const response = await api.put(`/technician-actions/update/${id}`, {
        diagnostics: data.diagnostics,
        adultery: data.adultery,
        cultivation: data.cultivation,
        fertilizing: data.fertilizing,
        plant_health: data.plant_health
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default TechnicianActionsService;

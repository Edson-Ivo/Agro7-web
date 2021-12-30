import { api } from './api';

class FieldsService {
  static async create(data) {
    try {
      const response = await api.post(`/fields/create`, { ...data });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/fields/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(id, data) {
    try {
      const response = await api.put(`/fields/update/${id}`, {
        name: data.name,
        area: data.area,
        type_dimension: data.type_dimension,
        coordinates: data.coordinates
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default FieldsService;

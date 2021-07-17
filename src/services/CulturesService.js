import { api } from './api';

class CulturesService {
  static async findAll() {
    return api.get('/cultures/find/all');
  }

  static async findById(id) {
    return api.get(`/cultures/find/by/id/${id}`);
  }

  static async findByField(fieldId) {
    return api.get(`/cultures/find/by/field/${fieldId}`);
  }

  static async create(data) {
    try {
      const response = await api.post(`/cultures/create`, { ...data });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/cultures/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(id, data) {
    try {
      const response = await api.put(`/cultures/update/${id}`, {
        date_start: data.date_start,
        date_finish: data?.date_finish,
        area: data.area,
        type_dimension: data.type_dimension,
        products: data.products
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default CulturesService;

import { api } from './api';

class NutricionalService {
  static async create(data) {
    try {
      const response = await api.post(`/nutritional/create`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(id, data) {
    try {
      const response = await api.put(`/nutritional/update/${id}`, data);
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async updateNutritionalImage(idNutritional, data) {
    try {
      const response = await api.put(
        `/nutritional-images/update/${idNutritional}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/nutritional/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default NutricionalService;

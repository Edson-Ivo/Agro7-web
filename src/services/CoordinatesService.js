import { api } from './api';

class CoordinatesService {
  static async findAll() {
    return api.get('/properties-coordinates/find/all');
  }

  static async findById(id) {
    return api.get(`/properties-coordinates/find/by/id/${id}`);
  }

  static async propertiesUpdate(id, data) {
    try {
      const response = await api.put(`/properties-coordinates/update/${id}`, {
        latitude: data.latitude,
        longitude: data.longitude
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async fieldsUpdate(id, data) {
    try {
      const response = await api.put(`/fields-coordinates/update/${id}`, {
        latitude: data.latitude,
        longitude: data.longitude
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/properties-coordinates/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default CoordinatesService;

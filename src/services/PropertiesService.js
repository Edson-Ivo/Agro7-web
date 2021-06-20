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

  static async createAdmin(id, data) {
    try {
      const response = await api.post(`/properties/create/user/${id}`, {
        ...data
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async createTechniciansProperties(data) {
    try {
      const response = await api.post(`/technicians-properties/create`, {
        ...data
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async createTechniciansPropertiesRequests(data) {
    try {
      const response = await api.post(`/technicians-requests/create`, {
        technicians: data.technicians,
        properties: data.properties
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/properties/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async deleteTechniciansProperties(id) {
    try {
      const response = await api.delete(`/technicians-properties/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async deleteTechniciansPropertiesRequests(id) {
    try {
      const response = await api.delete(`/technicians-requests/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(id, data) {
    try {
      const response = await api.put(`/properties/update/${id}`, {
        name: data.name,
        area: data.area,
        type_dimension: data.type_dimension,
        type_owner: data.type_owner,
        addresses: data.addresses,
        coordinates: data.coordinates
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async updateTechniciansPropertiesRequests(id, data) {
    try {
      const response = await api.put(`/technicians-requests/update/${id}`, {
        accepted: data.accepted
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default PropertiesService;

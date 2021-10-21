import { api } from './api';

class TechnicianActionsService {
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

  static async createImages(actionId, data) {
    try {
      const response = await api.post(
        `/technician-actions-images/${actionId}`,
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
      const response = await api.delete(`/technician-actions/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async deleteImage(id) {
    try {
      const response = await api.delete(`/technician-actions-images/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(id, data) {
    try {
      const response = await api.put(`/technician-actions/update/${id}`, {
        concluded: data.concluded,
        cultures: data.cultures
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default TechnicianActionsService;

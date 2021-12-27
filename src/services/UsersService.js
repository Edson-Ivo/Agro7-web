import { api } from './api';

class UsersService {
  static async create(data) {
    try {
      const response = await api.post(`/users/create`, { ...data });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async updateByAdmin(id, data) {
    try {
      const response = await api.put(`/users/update/${id}`, { ...data });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async updatePasswordByAdmin(id, data) {
    try {
      const response = await api.put(`/users/update-password/${id}`, {
        ...data
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async updateByOwner(data) {
    try {
      const response = await api.put(
        `/users/update/`,
        { ...data },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async updatePasswordByOwner(data) {
    try {
      const response = await api.put(
        `/users/update-password`,
        { ...data },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async deleteSoftwareByAdmin(id) {
    try {
      const response = await api.delete(`/users/delete-software/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async deletePermanentlyByAdmin(id) {
    try {
      const response = await api.delete(`/users/delete-permanently/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async resendConfirmEmail(id) {
    try {
      const response = await api.post(
        `/users/resend-confirm-email/by/id/${id}`,
        {}
      );

      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default UsersService;

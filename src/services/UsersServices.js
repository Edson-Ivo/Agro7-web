import { api } from './api';

class UsersService {
  static async findAll() {
    return api.get('/users/find/all');
  }

  static async findById(id) {
    return api.get(`/users/find/by/id/${id}`);
  }

  static async findByLogged() {
    return api.get('/users/find/by/logged/');
  }

  static async create(data) {
    try {
      const response = await api.create(
        `/users/create`,
        JSON.stringify({ data })
      );

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async updateByAdmin(id, data) {
    try {
      const response = await api.put(
        `/users/update/${id}`,
        JSON.stringify({ data })
      );
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async updatePasswordByAdmin(id, data) {
    try {
      const response = await api.put(
        `/users/update/password/${id}`,
        JSON.stringify({ data })
      );
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async updateByOwner(data) {
    try {
      const response = await api.put(
        `/users/update/`,
        JSON.stringify({ data })
      );
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async updatePasswordByOwner(data) {
    try {
      const response = await api.put(
        `/users/update/password/`,
        JSON.stringify({ data })
      );
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async deleteByOwnerAccount() {
    try {
      const response = await api.delete(`/users/`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async deleteByAdmin(id) {
    try {
      const response = await api.delete(`/users/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default UsersService;

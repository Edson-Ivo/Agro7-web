import { api } from './api';

class AddressesService {
  static async findAll() {
    return api.get('/addresses/find/all');
  }

  static async findById(id) {
    return api.get(`/addresses/find/by/id/${id}`);
  }

  static async getCep(number) {
    return api.get(`/addresses/find/cep/${number}`);
  }

  static async update(id, data) {
    try {
      const response = await api.put(
        `/addresses/${id}`,
        JSON.stringify({ data })
      );
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default AddressesService;

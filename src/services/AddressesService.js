import { api } from './api';

class AddressesService {
  static async getCep(number) {
    return api.get(`/properties-addresses/find/cep/${number}`);
  }

  static async usersUpdate(id, data) {
    try {
      const response = await api.put(`/users-addresses/update/${id}`, {
        state: data.state,
        street: data.street,
        city: data.city,
        neighborhood: data.neighborhood,
        number: data.number,
        complement: data.complement,
        postcode: data.postcode
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async propertiesUpdate(id, data) {
    try {
      const response = await api.put(`/properties-addresses/update/${id}`, {
        state: data.state,
        city: data.city,
        locality: data.locality,
        access: data.access,
        postcode: data.postcode
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default AddressesService;

import { api } from './api';

class AddressesService {
  static async getCep(number) {
    return api.get(`/properties-addresses/find/cep/${number}`);
  }
}

export default AddressesService;

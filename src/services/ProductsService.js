import { api } from './api';

class ProductsService {
  static async findAll() {
    return api.get(`/products/find/all`);
  }

  static async findById(id) {
    return api.get(`/products/find/by/id/${id}`);
  }

  static async create(data) {
    try {
      const response = await api.post(`/products/create`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async update(idProduct, data) {
    try {
      const response = await api.put(`/products/${idProduct}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async updateNutritional(idNutritional, data) {
    try {
      const response = await api.put(
        `/nutritional/update/${idNutritional}`,
        data
      );
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/products/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default ProductsService;

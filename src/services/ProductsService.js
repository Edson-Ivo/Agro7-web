import * as yup from 'yup';

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

  static async delete(id) {
    try {
      const response = await api.delete(`/products/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static schema(edit = false) {
    const nutritionalSchema = {
      water: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Água (%) deve ser um valor positivo')
        .nullable(),
      calories: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Calorias (Kcal) deve ser um valor positivo')
        .nullable(),
      protein: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Proteína (g) deve ser um valor positivo')
        .nullable(),
      carbohydrate: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Carboidrato (g) deve ser um valor positivo')
        .nullable(),
      dietary_fiber: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Fibra Alimentar (g) deve ser um valor positivo')
        .nullable(),
      cholesterol: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Colesterol (mg) deve ser um valor positivo')
        .nullable(),
      lipids: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Lipídios (g) deve ser um valor positivo')
        .nullable(),
      saturated_fatty_acid: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Ácido Graxo Saturado (g) deve ser um valor positivo')
        .nullable(),
      unsaturated_fatty_acid: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive(
          'O campo Ácido Graxo Mono insaturado (g) deve ser um valor positivo'
        )
        .nullable(),
      polyunsaturated_fatty_acid: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive(
          'O campo Ácido Graxo Poli insaturado (g) deve ser um valor positivo'
        )
        .nullable(),
      calcium: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Cálcio (mg) deve ser um valor positivo')
        .nullable(),
      phosphorus: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Fósforo (mg) deve ser um valor positivo')
        .nullable(),
      iron: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Ferro (mg) deve ser um valor positivo')
        .nullable(),
      potassium: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Potássio (mg) deve ser um valor positivo')
        .nullable(),
      sodium: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Sódio (mg) deve ser um valor positivo')
        .nullable(),
      vitamin_b1: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Vitamina B1 (mg) deve ser um valor positivo')
        .nullable(),
      vitamin_b2: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Vitamina B2 (mg) deve ser um valor positivo')
        .nullable(),
      vitamin_b3: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Vitamina B3 (mg) deve ser um valor positivo')
        .nullable(),
      vitamin_b6: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Vitamina B6 (mg) deve ser um valor positivo')
        .nullable(),
      vitamin_c: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .positive('O campo Vitamina C (mg) deve ser um valor positivo')
        .nullable()
    };

    const nutritionalDefault = !edit
      ? { ...nutritionalSchema }
      : {
          nutritional: yup.object().shape({
            ...nutritionalSchema
          })
        };

    const schema = yup.object().shape({
      name: yup.string().required('O campo nome é obrigatório!'),
      description: yup.string().nullable(),
      green: yup.object().shape({
        ...nutritionalSchema
      }),
      ...nutritionalDefault
    });

    return schema;
  }
}

export default ProductsService;

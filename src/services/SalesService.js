import * as yup from 'yup';

import { api } from './api';

class SalesService {
  static async getDistributor(id) {
    return api.get(`/distributors/find/by/id/${id}`);
  }

  static async getTransporter(id) {
    return api.get(`/transporters/find/by/id/${id}`);
  }

  static async getTransporterVehicle(id) {
    return api.get(`/transporters-vehicles/find/by/id/${id}`);
  }

  static async getTransporterVehiclesByProperty(idProperty) {
    return api.get(`/transporters-vehicles/find/by/property/${idProperty}`);
  }

  static async create(data) {
    try {
      const response = await api.post(`/sales/create`, { ...data });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async createAdmin(id, data) {
    try {
      const response = await api.post(`/sales/create/user/${id}`, { ...data });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async createTransporterDocument(id, data) {
    try {
      const response = await api.post(
        `/transporters-documents/create/${id}`,
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
      const response = await api.delete(`/sales/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async deleteDistributor(id) {
    try {
      const response = await api.delete(`/distributors/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async deleteTransporter(id) {
    try {
      const response = await api.delete(`/transporters/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async deleteTransporterDocument(id) {
    try {
      const response = await api.delete(`/transporters-documents/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static schema(maxQtd) {
    const schema = yup.object().shape({
      properties: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .required('A propriedade deve ser selecionada'),
      products: yup.object().shape({
        type_unity: yup
          .string()
          .required('Unidade de medida precisa ser definida'),
        is_green: yup
          .boolean()
          .required('Deve selecionar se o produto está verde ou não'),
        quantity: yup
          .number()
          .transform(value => (Number.isNaN(value) ? undefined : value))
          .positive('Quantidade deve ser maior que 0')
          .max(maxQtd, `Quantidade deve ser menor ou igual à ${maxQtd}`)
          .required('O campo quantidade da venda é obrigatório')
      }),
      distributors: yup.object().shape({
        name: yup
          .string()
          .required('O campo nome da distribuidora é obrigatório'),
        document: yup
          .string()
          .min(11)
          .required('O campo documento é obrigatório'),
        area: yup
          .number()
          .transform(value => (Number.isNaN(value) ? undefined : value))
          .required('A área da distribuidora precisa ser definida')
          .positive('A área da distribuidora precisa ter um valor positivo'),
        type_dimension: yup
          .string()
          .required(
            'Unidade de medida da área da distribuidora precisa ser definida'
          ),
        postcode: yup
          .string()
          .min(
            9,
            'Você tem que digitar no mínimo e no máximo 9 caracteres para o CEP da distribuidora. Ex: 00000-000'
          )
          .max(
            9,
            'Você tem que digitar no mínimo e no máximo 9 caracteres para o CEP da distribuidora. Ex: 00000-000'
          )
          .required('Você precisa informar o CEP da distribuidora'),
        state: yup
          .string()
          .min(
            2,
            'O estado da distribuidora tem que ter no mínimo 2 caracteres'
          )
          .max(
            15,
            'Você não pode ultrapassar 15 caracteres no nome do estado da distribuidora'
          )
          .required('Você precisa informar o estado da distribuidora.'),
        city: yup
          .string()
          .min(
            2,
            'O nome da cidade da distribuidora tem que ter no mínimo 2 caracteres'
          )
          .max(
            50,
            'O nome da cidade da distribuidora não pode ultrapassar 50 caracteres'
          )
          .required('Você precisa informar a cidade da distribuidora'),
        neighborhood: yup
          .string()
          .min(
            2,
            'O nome do bairro da distribuidora tem que ter no mínimo 2 caracteres'
          )
          .max(
            50,
            'Você não pode ultrapassar 50 caracteres no nome do bairro da distribuidora'
          )
          .required('Você precisa informar o bairro da distribuidora'),
        street: yup
          .string()
          .max(
            50,
            'O nome da rua da distribuidora não pode ultrapassar 50 caracteres'
          )
          .required('Você precisa informar a rua do endereço da distribuidora'),
        number: yup
          .string()
          .max(
            50,
            'O número do endereço da distribuidora não pode ultrapassar 50 caracteres'
          )
          .required(
            'Você precisa informar o número do endereço da distribuidora'
          ),
        latitude: yup
          .number()
          .transform(value => (Number.isNaN(value) ? undefined : value))
          .required('A latitude da distribuidora é obrigatória'),
        longitude: yup
          .number()
          .transform(value => (Number.isNaN(value) ? undefined : value))
          .required('A longitude da distruibuidora é obrigatória')
      }),
      transporters: yup.object().shape({
        name: yup
          .string()
          .required('O campo nome da transportadora é obrigatório'),
        document: yup
          .string()
          .min(11)
          .required('O campo documento da transportadora é obrigatório'),
        phone: yup
          .string()
          .required('O campo telefone da transportadora é obrigatório'),
        vehicles: yup.object().shape({
          name: yup.string().required('O campo nome do veículo é obrigatório'),
          plate: yup
            .string()
            .required('O campo placa do veículo é obrigatório'),
          description: yup
            .string()
            .required('O campo descrição do veículo é obrigatório')
        })
      }),
      value: yup
        .number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .required('O campo preço da venda é obrigatório')
    });

    return schema;
  }
}

export default SalesService;

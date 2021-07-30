import { api } from './api';

class ProfilesService {
  static async update(idUserProfile, data) {
    try {
      const response = await api.put(
        `/users-profiles/update/${idUserProfile}`,
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

  static async createGallery(idUserProfile, data) {
    try {
      const response = await api.post(
        `/profiles-galleries/create/${idUserProfile}`,
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

  static async deleteGallery(id) {
    try {
      const response = await api.delete(`/profiles-galleries/${id}`);

      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default ProfilesService;

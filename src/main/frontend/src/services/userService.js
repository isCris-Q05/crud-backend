import axios from 'axios';
import authService from './authService';

const API_URL = "http://localhost:8080/api/users";

axios.interceptors.request.use(config => {
    const token = authService.getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

const getAllUsers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener usuarios: ", error.response?.data || error.message);

        // si el error es 401
        if (error.response?.status === 401) {
            authService.logout();
            window.location.reload();
        }

        throw error;
    }
}

const createUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        console.log("Usuario creado");
        return response.data
    } catch (error) {
        console.error('Error al crear usuario:', error.response?.data || error.message);
        throw error;
    }
}

const updateUser = async(id, userData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, userData);
        // Usuario actualizado
        return response.data;
    } catch (error) {
        console.error('Error al crear usuario:', error.response?.data || error.message);
        throw error;
    }
}

const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log("Usuario eliminado");
    return response.data;
  } catch (error) {
    console.error('Error al eliminar usuario:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
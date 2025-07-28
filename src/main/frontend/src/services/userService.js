import axios from 'axios';
import authService from './authService';

const API_URL = "http://localhost:8080/api/users";


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

const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    console.log("Usuario obtenido:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener usuario:", error.response?.data || error.message);
    throw error;
  }
};

const createUser = async (userData) => {
    try {
        console.log(`Imagen: ${userData.profile_picture_link}`);
        const response = await axios.post(`${API_URL}/register`, {
          username: userData.username,
          password: userData.password,
          email: userData.email,
          profilePictureLink: userData.profile_picture_link || null,
          isActive: userData.isActive === false ? false : true, // por defecto es true
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log("Usuario creado");
        return response.data
    } catch (error) {
        console.error('Error al crear usuario:', error.response?.data || error.message);
        throw error;
    }
}

const updateUser = async(id, userData) => {
    try {
        console.log(`Estado: ${userData.isActive}`);
        const response = await axios.put(`${API_URL}/${id}`, {
          username: userData.username,
          email: userData.email,
          profilePictureLink: userData.profilePictureLink || null,
          isActive: userData.isActive === false ? false : true, // por defecto es true
        });
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
  deleteUser,
    getUserById
};
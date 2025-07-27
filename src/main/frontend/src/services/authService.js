import axios from "axios";

const API_URL = "http://localhost:8080/api";
const AUTH_URL = `${API_URL}/auth`

// vamos a crear interceptores, asi agregamos el token a todas las peticiones
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},  (error) => {
    return Promise.reject(error);
}
);

// este interceptor es cuando no esta autenticado
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            // si no esta autenticado, redirigimos a login
            // token invalido o expirado, entonces hacemos logout
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
)


const login = async(username, password) => {
    try {
        console.log(`Username: ${username} // Password: ${password}`);
        const response = await axios.post(`${AUTH_URL}/login`, {
            username,
            password
        })

        if (response.data && response) {
            // guardamos token
            localStorage.setItem("user", username);
            localStorage.setItem("token", response.data);
        }
        console.log("Inicio de sesion exitoso");
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }

}

const logout= async()  => {
    // llamamos el endpoint de logout
    try {
        const token = localStorage.getItem("token");
        if (token) {
            await axios.post(`${AUTH_URL}/logout`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
        
        console.log("Logout exitoso");
    } catch (error) {
        console.error("Error al hacer logout");
        // limpiamos de igual manera

        throw error;
    } finally {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }
    
}

const getToken = () => {
    return localStorage.getItem("token");
}

const getCurrentUser = () => {
    return localStorage.getItem("user");
}

export default {
    login,
    logout,
    getToken,
    getCurrentUser
}
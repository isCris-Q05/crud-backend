import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const login = async(username, password) => {
    try {
        console.log(`Username: ${username} // Password: ${password}`);
        const response = await axios.post(`${API_URL}/login`, {
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

const logout=() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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
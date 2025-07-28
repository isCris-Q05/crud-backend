import requests
from requests.exceptions import RequestException
import logging

# Configuración básica de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ApiClient:
    def __init__(self, base_url="http://localhost:8080"):
        self.base_url = base_url
        self.session = requests.Session()
        self.token = None
    
    def authenticate(self, username, password):
        """Autentica al usuario y guarda el token para futuras peticiones"""
        try:
            response = self.session.post(
                f"{self.base_url}/api/users/authenticate",
                json={"username": username, "password": password}
            )
            
            if response.status_code == 200:
                self.token = response.json().get('token')
                # Configuramos el token en los headers para futuras peticiones
                self.session.headers.update({'Authorization': f'Bearer {self.token}'})
                return True
            
            logger.error(f"Error en autenticación: {response.status_code} - {response.text}")
            return False
            
        except RequestException as e:
            logger.error(f"Error de conexión al autenticar: {str(e)}")
            return False
    
    def create_user(self, user_data):
        """Crea un nuevo usuario"""
        try:
            response = self.session.post(
                f"{self.base_url}/api/users",
                json=user_data
            )
            
            if response.status_code == 201:
                return response.json()
                
            logger.error(f"Error al crear usuario: {response.status_code} - {response.text}")
            return None
            
        except RequestException as e:
            logger.error(f"Error de conexión al crear usuario: {str(e)}")
            return None
    
    def get_user(self, user_id):
        """Obtiene un usuario por su ID"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/users/{user_id}"
            )
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                return None
                
            logger.error(f"Error al obtener usuario: {response.status_code} - {response.text}")
            return None
            
        except RequestException as e:
            logger.error(f"Error de conexión al obtener usuario: {str(e)}")
            return None
    
    def update_user_email(self, user_id, new_email):
        """Actualiza el email de un usuario"""
        try:
            # Obtenemos los datos actuales del usuario
            current_user = self.get_user(user_id)
            if not current_user:
                return False
            
            # Preparamos los datos actualizados
            updated_data = {
                "username": current_user["username"],
                "email": new_email,
                "password": current_user["password"],
                "is_active": current_user.get("is_active", True)
            }

            response = self.session.put(
                f"{self.base_url}/api/users/{user_id}",
                json=updated_data
            )
            
            return response.status_code == 200
            
        except RequestException as e:
            logger.error(f"Error de conexión al actualizar usuario: {str(e)}")
            return False
    
    def delete_user(self, user_id):
        """Elimina un usuario"""
        try:
            response = self.session.delete(
                f"{self.base_url}/api/users/{user_id}"
            )
            
            return response.status_code == 204
            
        except RequestException as e:
            logger.error(f"Error de conexión al eliminar usuario: {str(e)}")
            return False
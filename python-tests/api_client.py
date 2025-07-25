import requests

# en este archivo cosumiremos las APIS de la aplicacion
class ApiClient:
    # url base de la API
    # constructor, inicializamos el objeto cuando se crea una instancia de ApiClient
    def __init__(self, base_url = "http://localhost:8080/"):
        self.base_url = base_url
        self.session = requests.Session()
        self.token = None
    
    # metodo para autenticar al usuario
    def authenticate(self, username, password):
        # Autentica el usuario y obtiene un token
        response = self.session.post(
            f"{self.base_url}/api/users/authenticate",
            params={"username": username, "password": password}
        )
        return response.ok
    
    # metodo para crear el usuario
    def create_user(self, user_data):
        # se crea un nuevo usuario
        response = self.session.post(
            f"{self.base_url}/api/users",
            json=user_data
        )
        if response.ok:
            return response.json()
        return None
    
    # metodo para obtener usuario por ID
    def get_user(self, user_id):
        response = self.session.get(
            f"{self.base_url}/api/users/{user_id}"
        )
        if response.ok:
            return response.json()
        return None
    
    # metodo para actualizar usuario
    def update_user_email(self, user_id, new_email):
        # primero obtenemos al usuario
        current_user = self.get_user(user_id)
        if not current_user:
            return False
        
        updated_data = {
            "username": current_user["username"],
            "email": new_email,
            "password": current_user["password"]
        }

        response = self.session.put(
            f"{self.base_url}/api/users/{user_id}",
            json=updated_data
        )
        return response.ok
    
    # metodo para eliminar usuario
    def delete_user(self, user_id):
        response = self.session.delete(
            f"{self.base_url}/api/users/{user_id}"
        )
        return response.ok
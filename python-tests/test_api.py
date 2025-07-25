import pytest
from api_client import ApiClient
import random

@pytest.fixture
def api_client():
    # a. autenticamos con el usuario por defecto
    client = ApiClient()
    # 
    assert client.authenticate("admin", "admin123") # verificamos que la autenticación es exitosa
    return client

def test_user_crud_operations(api_client):
    # generamos username unico 
    random_sufijo = random.randint(100, 999)
    test_username = f"testuser_{random_sufijo}"
    # b. creacion de usuario

    test_user = {
        'username': test_username,
        'email': f"{test_username}@example.com",
        'password': 'testpass123'
    }
    # creamos un usuario
    created_user = api_client.create_user(test_user)
    # verificamos que se ha creado el usuario
    assert created_user is not None, "Fallo al crear el usuario"

    # obtenemos e id
    user_id = created_user['id']

    # c. consuta de detalles
    user_details = api_client.get_user(user_id)
    assert user_details["username"] == test_username, "Usuario incorrecto"

    # d. actualizacion de usuario
    new_email = f"updated_{test_username}@example.com"
    assert api_client.update_user_email(user_id, new_email), "Fallo al actualizar"
    updated_user = api_client.get_user(user_id)
    assert updated_user["email"] == new_email, "Email no se actualizo"

    # e. eliminacion del uusuario
    assert api_client.delete_user(user_id), "Fallo en eliminar usuario"
    assert api_client.get_user(user_id) is None, "Usuario no fue eliminado, error"

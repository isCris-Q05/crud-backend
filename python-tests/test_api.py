import pytest
from api_client import ApiClient
import random
import logging

# Configuración de logging para pruebas
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@pytest.fixture
def api_client():
    """Fixture que proporciona un cliente API autenticado"""
    client = ApiClient()
    
    # Intenta autenticar con credenciales por defecto
    if not client.authenticate("admin", "admin123"):
        pytest.skip("No se pudo autenticar con usuario admin/admin123. Verifica las credenciales.")
    
    return client

def test_user_crud_operations(api_client):
    """Prueba completa de operaciones CRUD para usuarios"""
    # Generamos un username único para evitar colisiones
    random_suffix = random.randint(1000, 9999)
    test_username = f"testuser_{random_suffix}"
    
    # Datos del usuario de prueba
    test_user = {
        'username': test_username,
        'email': f"{test_username}@example.com",
        'password': 'testpass123',
        'is_active': True
    }
    
    # b. Creación de usuario
    created_user = api_client.create_user(test_user)
    assert created_user is not None, "Fallo al crear el usuario"
    logger.info(f"Usuario creado con ID: {created_user['id']}")
    
    user_id = created_user['id']
    
    # c. Consulta de detalles
    user_details = api_client.get_user(user_id)
    assert user_details is not None, "No se pudo obtener el usuario recién creado"
    assert user_details["username"] == test_username, "El username no coincide"
    assert user_details["email"] == test_user["email"], "El email no coincide"
    
    # d. Actualización de email
    new_email = f"updated_{test_username}@example.com"
    assert api_client.update_user_email(user_id, new_email), "Fallo al actualizar el email"
    
    # Verificamos la actualización
    updated_user = api_client.get_user(user_id)
    assert updated_user["email"] == new_email, "El email no se actualizó correctamente"
    
    # e. Eliminación del usuario
    assert api_client.delete_user(user_id), "Fallo al eliminar el usuario"
    
    # Verificamos que ya no existe
    deleted_user = api_client.get_user(user_id)
    assert deleted_user is None, "El usuario no fue eliminado correctamente"

def test_authentication_failure():
    """Prueba que la autenticación falla con credenciales incorrectas"""
    client = ApiClient()
    assert not client.authenticate("invalid", "credentials"), "La autenticación debería fallar con credenciales inválidas"

@pytest.mark.skip(reason="Requiere usuario específico en la base de datos")
def test_get_nonexistent_user(api_client):
    """Prueba obtener un usuario que no existe"""
    assert api_client.get_user(999999) is None, "Debería retornar None para un usuario inexistente"
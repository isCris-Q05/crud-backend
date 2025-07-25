from api_client import ApiClient

def main():
    client = ApiClient()

    # a. auntenticacion
    if client.authenticate("admin", "admin123"):
        print("Autenticación exitosa :)")
    else:
        print("Error en la autenticación :(")
        return
    
    # b. creacion de usuario
    new_user = {
        'username': 'pythonista',
        'email': 'python@example.com',
        'password': 'python123'
    }
    created = client.create_user(new_user)
    if created:
        user_id = created['id']

        # c. obtneniendo detalles
        details = client.get_user(user_id)
        print(f"Detalles del usuario: {details}")

        # d. actualizar email
        if client.update_user_email(user_id, "pythonnuevo@example.com"):
            print("Email actualizado!")
            updated_details = client.get_user(user_id)
            print(f"Nuevos dettales actualizados: {updated_details}")


        # e. eliminar usuario
        if client.delete_user(user_id):
            print(f"El usuario {user_id} fue eliminado")
    



if __name__ == "__main__":
    main()
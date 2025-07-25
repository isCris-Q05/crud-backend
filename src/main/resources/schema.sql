USE prueba_backend;

CREATE TABLE IF NOT EXISTS users(
	id INT auto_increment PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100),
    password VARCHAR (255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT current_timestamp,
    updated_at TIMESTAMP NULL,
    created_by VARCHAR(50), /*Aqui seria el username*/
    updated_by VARCHAR(50),
    profile_picture_link VARCHAR(255)
) engine = InnoDB; /*garantizamos integridad de datos(insertar datos)*/

/*vamos a comprobar los campos de la tabla que creamos*/
SHOW columns from prueba_backend.users;

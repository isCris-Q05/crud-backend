package com.backendtest.crud.Service;

// aca escribiremos la logica de negocio
// y los metodos que usaremos en el controlador/vista

import com.backendtest.crud.Entity.User;
import com.backendtest.crud.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    // inyectamos el repositorio
    // lo hace de manera automatica de dependencias de una clase
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // metodo para mostrar todos los usuarios
    private AuthenticationManager authenticationManager;

    public List<User> getAllUsers() {
        // ira dentro de un try catch, para manejar excepciones
        try {
            // validamos si esta autenticado
            // si no esta autenticado, lanzamos una excepcion
            return userRepository.findAll();
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al obtener los usuarios: " + e.getMessage()
            );
        }
    }
    // metodo para buscar un usuario por id
    // ponemos optional para que pueda ser null
    // si no se encuentra el usuario
    public Optional<User> getUserById(Long id) {
        // ira dentro de un try catch, para manejar excepciones
        try{
            Optional<User> user = userRepository.findById(id);
            // si no se encuentra el usuario lanzamos una excepcion
            if (user.isEmpty()) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado con id: " + id
                );
            }
            System.out.println("Usuario encontrado: " + user.get().getUsername());
            return user; // devolvemos el usuario
        } catch (ResponseStatusException e) {
            System.out.println("Error: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al obtener el usuario: " + e.getMessage()
            );
        }
    }

    // metodo para crear un usuario
    public User createUser(User user, String currentUsername) {
        // ira dentro de un try catch, para manejar excepciones
        try {
            // comprobamos los datos del usuario que se pasan
            System.out.println("Username: " + user.getUsername());
            System.out.println("Email: " + user.getEmail());
            System.out.println("Profile: " + user.getProfilePictureLink());

            // verificamos si el usuario ya existe
            if (userRepository.findByUsername(user.getUsername()) != null) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "El nombre de usuario ya existe"
                );
            }

            // verificamos si el  email ya existe
            if (user.getEmail() != null && !user.getEmail().isEmpty() &&
            userRepository.findByEmail(user.getEmail()) != null) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "El email ya esta en uso"
                );
            }
            // generamos un password hasheado
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            // Set createdBy with the username of the user creating this account
            user.setCreatedBy(currentUsername);
            // guardamos el usuario en la base de datos
            return userRepository.save(user);
        } catch (ResponseStatusException e) {
            System.out.println("Error: " + e.getMessage());
            // lo mostramos en formato JSON
            throw e; // si hay un error, lanzamos la excepcion

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al crear el usuario: " + e.getMessage()
            );
        }

    }

    // metodo para actualizar un usuario
    public User updateUser(Long id, User userDetails, String currentUsername) {
        try {
            User user = userRepository.findById(id).orElseThrow(
                    () -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Usuario no encontrado con id: " + id
                    )
            );

            // Validación del username
            if (userDetails.getUsername() != null &&
                    !userDetails.getUsername().equalsIgnoreCase(user.getUsername())) {

                boolean usernameExists = userRepository.existsByUsernameIgnoreCase(userDetails.getUsername());
                if (usernameExists) {
                    User existingUser = userRepository.findByUsernameIgnoreCase(userDetails.getUsername());
                    if (!existingUser.getId().equals(user.getId())) {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "El nombre de usuario ya está en uso por otro usuario"
                        );
                    }
                }
                user.setUsername(userDetails.getUsername());
            }

            // Validación del email (nueva verificación)
            if (userDetails.getEmail() != null &&
                    !userDetails.getEmail().equalsIgnoreCase(user.getEmail())) {

                boolean emailExists = userRepository.existsByEmailIgnoreCase(userDetails.getEmail());
                if (emailExists) {
                    User existingUser = userRepository.findByEmailIgnoreCase(userDetails.getEmail());
                    if (!existingUser.getId().equals(user.getId())) {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "El email ya está en uso por otro usuario"
                        );
                    }
                }
                user.setEmail(userDetails.getEmail());
            }

            // Resto de las actualizaciones
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }

            if (userDetails.getProfilePictureLink() != null) {
                user.setProfilePictureLink(userDetails.getProfilePictureLink());
            }

            if (userDetails.getIsActive() != null) {
                user.setIsActive(userDetails.getIsActive());
            }

            user.setUpdatedBy(currentUsername);
            return userRepository.save(user);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al actualizar el usuario: " + e.getMessage()
            );
        }
    }
    //  metodo para eliminar un usuario
    public void deleteUser(Long id) {
        // ira dentro de un try catch, para manejar excepciones
        try {
            // verficamos si el usuario existe
            if (!userRepository.existsById(id)) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado con id: " + id
                );
            }
            userRepository.deleteById(id); // eliminamos el usuario por id
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al eliminar el usuario: " + e.getMessage()
            );
        }

    }

    public User findByUsername(String username) {
        try{
            // buscamos el usuario por nombre de usuario
            User user = userRepository.findByUsername(username);
            // si no se encuentra lanzamos una excepcion
            if (user == null) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado con nombre de usuario: " + username
                );
            }
            return userRepository.findByUsername(username);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al buscar el usuario: " + e.getMessage()
            );
        }
    }
}

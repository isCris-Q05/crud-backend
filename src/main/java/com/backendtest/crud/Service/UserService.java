package com.backendtest.crud.Service;

// aca escribiremos la logica de negocio
// y los metodos que usaremos en el controlador/vista

import com.backendtest.crud.Entity.User;
import com.backendtest.crud.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        // verificamos si el usuario esta autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Usuario autenticado: " + (authentication != null ? authentication.getName() : "Ninguno"));

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuario no autenticado"
            );
        }
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
    public User createUser(User user) {
        // ira dentro de un try catch, para manejar excepciones
        try {
            // verificamos si el usuario ya existe
            if (userRepository.findByUsername(user.getUsername()) != null) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "El nombre de usuario ya existe"
                );
            }
            // generamos un password hasheado
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            // guardamos el usuario en la base de datos
            return userRepository.save(user);
        } catch (ResponseStatusException e) {
            throw e; // si hay un error, lanzamos la excepcion
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al crear el usuario: " + e.getMessage()
            );
        }

    }

    // metodo para actualizar un usuario
    public User updateUser(Long id, User userDetails) {
        // ira dentro de un try catch, para manejar excepciones
        try {
            // verificamos si el usuario existe
            // buscamos el usuario por el id
            User user = userRepository.findById(id).orElseThrow(
                    () -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Usuario no encontrado con id: " + id
                    )
            ); // si no se encuentra, lanzamos una excepcion
            // ahora si el usuario al cambiar por otro nombre ya existe
            User existingUser = userRepository.findByUsername(userDetails.getUsername());
            if (existingUser != null && !existingUser.getId().equals(id)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "El nombre de usuario ya existe"
                );
            }
            user.setEmail(userDetails.getEmail());
            user.setUsername(userDetails.getUsername());

            // Actualizamos la contraseña solo si se proporciona una nueva
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }
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

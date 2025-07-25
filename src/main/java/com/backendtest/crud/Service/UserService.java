package com.backendtest.crud.Service;

// aca escribiremos la logica de negocio
// y los metodos que usaremos en el controlador/vista

import com.backendtest.crud.Entity.User;
import com.backendtest.crud.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    // metodo para buscar un usuario por id
    // ponemos optional para que pueda ser null
    // si no se encuentra el usuario
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // metodo para crear un usuario
    public User createUser(User user) {
        // generamos un password hasheado
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // guardamos el usuario en la base de datos
        return userRepository.save(user);
    }

    // metodo para actualizar un usuario
    public User updateUser(Long id, User userDetails) {
        // buscamos el usuario por el id
        User user = userRepository.findById(id).orElseThrow(); // si no se encuentra, lanzamos una excepcion
        user.setEmail(userDetails.getEmail());
        user.setUsername(userDetails.getUsername());
        return userRepository.save(user);

    }

    //  metodo para eliminar un usuario
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // metodo para autenticar un usuario
    public boolean aunthenticateUser(String username, String password) {
        // buscamos el usuario por el username
        User user = userRepository.findByUsername(username);
        // si no se encuentra el usuario, retornamos false
        if (user == null) {
            return false;
        }
        // comparamos el password hasheado con el password que se ingreso
        return passwordEncoder.matches(password, user.getPassword());
    }
}

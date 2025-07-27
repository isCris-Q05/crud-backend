package com.backendtest.crud.Controller;

import com.backendtest.crud.Entity.User;
import com.backendtest.crud.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// le indicamos que es un controlador REST
@RestController
@RequestMapping("/api/users") //las peticiones van a ser en la ruta /api/users
public class UserController {
    @Autowired
    private UserService userService; // inyectamos el servicio de usuario

    // endpoint para obtener todos los usuarios
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // endpoint para obtener un usuario por id
    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // endpoint para crear un usuario
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // endpoint para actualizar un usuario
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userService.updateUser(id, userDetails);
    }

    // endpoint para eliminar un usuario
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    // endpoint para autenticar un usuario

}

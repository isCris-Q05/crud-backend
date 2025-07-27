package com.backendtest.crud.Controller;

import com.backendtest.crud.Entity.User;
import com.backendtest.crud.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            throw e;
        }
    }

    // endpoint para actualizar un usuario
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try{
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            throw e;
        }
    }

    // endpoint para eliminar un usuario
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    // endpoint para autenticar un usuario

}

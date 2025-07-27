package com.backendtest.crud.Controller;

import com.backendtest.crud.DTO.ApiResponse;
import com.backendtest.crud.Entity.User;
import com.backendtest.crud.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.http.HttpResponse;
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
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Usuarios obtenidos exitosamente",
                        users
                )
        );
    }

    // endpoint para obtener un usuario por id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado con id: " + id
                ));
        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Usuario encontrado exitosamente",
                        user
                )
        );
    }

    // endpoint para crear un usuario
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(
                        HttpStatus.CREATED.value(),
                        "Usuario creado exitosamente",
                        createdUser
                )
        );
    }

    // endpoint para actualizar un usuario
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Usuario actualizado exitosamente",
                        updatedUser
                )
        );
    }

    // endpoint para eliminar un usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Usuario eliminado exitosamente",
                        null
                )
        );
    }

    // endpoint para autenticar un usuario

}

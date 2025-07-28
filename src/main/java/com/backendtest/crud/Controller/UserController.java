package com.backendtest.crud.Controller;

import com.backendtest.crud.Configuration.JwtTokenProvider;
import com.backendtest.crud.DTO.ApiResponse;
import com.backendtest.crud.Entity.User;
import com.backendtest.crud.Repository.UserRepository;
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
    public ResponseEntity<ApiResponse<User>> createUser(
            @RequestBody User user,
            @RequestHeader(value = "Authorization", required = false) String token) {
        String currentUsername = (token != null) ? extractUsernameFromToken(token) : "system";
        User createdUser = userService.createUser(user, currentUsername);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(
                        HttpStatus.CREATED.value(),
                        "Usuario creado exitosamente",
                        createdUser
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(
            @PathVariable Long id,
            @RequestBody User userDetails,
            @RequestHeader("Authorization") String token) {

        try {
            String currentUsername = extractUsernameFromToken(token);
            User userToUpdate = userRepository.findById(id).orElseThrow(
                    () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado")
            );

            // Verificar si el usuario que se está editando es el mismo que tiene la sesión
            boolean isCurrentUser = userToUpdate.getUsername().equals(currentUsername);

            User updatedUser = userService.updateUser(id, userDetails, currentUsername);

            // Solo generar nuevo token si es el usuario actual y cambió el username
            if (isCurrentUser && !updatedUser.getUsername().equals(currentUsername)) {
                String oldToken = token.substring(7);
                String newToken = jwtTokenProvider.generateToken(updatedUser.getUsername());

                jwtTokenProvider.allowBothTokens(oldToken, newToken);

                return ResponseEntity.ok()
                        .header("New-Token", newToken)
                        .header("Access-Control-Expose-Headers", "New-Token")
                        .body(new ApiResponse<>(
                                HttpStatus.OK.value(),
                                "Usuario actualizado. Se ha generado un nuevo token.",
                                updatedUser
                        ));
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            HttpStatus.OK.value(),
                            "Usuario actualizado exitosamente",
                            updatedUser
                    )
            );
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(
                    new ApiResponse<>(
                            e.getStatusCode().value(),
                            e.getReason(),
                            null
                    )
            );
        }
    }

    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private UserRepository userRepository;
    // metodo para extraer el username del token
    private String extractUsernameFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtTokenProvider.getUsernameFromToken(token);
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

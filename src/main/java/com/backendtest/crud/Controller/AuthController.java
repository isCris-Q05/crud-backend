package com.backendtest.crud.Controller;

import com.backendtest.crud.Configuration.JwtTokenProvider;
import com.backendtest.crud.Entity.User;
import com.backendtest.crud.Service.CustomUserDetailsService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    // es el administrador de autenticacion
    // se encarga de autenticar al usuario pues
    private AuthenticationManager authenticationManager;
    // es el proveedor de tokens JWT
    // aqui generamos y validmos los tokens de JWT
    private JwtTokenProvider jwtTokenProvider;
    private CustomUserDetailsService userDetailsService;


    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider,
                          CustomUserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    // endpoint login
    @PostMapping("/login")
    public String login(@RequestBody User loginRequest) {
        System.out.println("Login request: " + loginRequest.getUsername());
        System.out.println("Login request password: " + loginRequest.getPassword());

        // primero vams a autenticar al usuario
        // aqui lo que hacemos es con el objeto de autenticacion
        // esto es de Spring Security
        // funcional igual al DRF de Django
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // si es exitosa, tomamos detalles del usuario y generamos un token JWT
        // aqui el usuario ya esta autenticado
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtTokenProvider.generateToken(userDetails.getUsername());
    }

    // endpoint que checa si el usuario esta autenticado
    @GetMapping("/check")
    public String checkAuth() {
        return "{\"authenticated\": true}";
    }

    // logout endpoint
    @PostMapping("/logout")
    // response entity es clase de string que representa una respuesta HTTP
    // pues con esto personalizamos la respuesta HTTP
    // y podemos devolver un codigo de estado HTTP y cuerpo de responsee

    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String token = extractToken(request);
        System.out.println("Token extraido: " + token);
        if (token != null) {
            // invalidamos el token
            jwtTokenProvider.invalidateToken(token);

            // limpiamos el contexto de seguridad
            SecurityContextHolder.clearContext();
            System.out.println("Token invalidado: " + token);

            // limpiamos cookies
            Cookie jwtCookie = new Cookie("jwt", null);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(true);
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(0);
            response.addCookie(jwtCookie);

            // retornamos una respuesta exitosa
            return ResponseEntity.ok().body(Map.of("message", "Logout exitoso"));
        }
        // si no hay token, retornamos un error
        return ResponseEntity.badRequest().body(
                Map.of("message", "No se encontro el token")
        );
    }

    // metodo para extraer el token del request
    private String extractToken(HttpServletRequest request) {
        String bearToken = request.getHeader("Authorization");
        // comprobamos que el token empieza con bearer
        //
        if (bearToken != null && bearToken.startsWith("Bearer ")) {
            // si se cumple le quitamos el bearer
            return bearToken.substring(7);
        }
        return null;
    }

    // endpoint para manejar OPTIONS (necesario para CORS)
    @RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }
}

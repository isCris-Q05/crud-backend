package com.backendtest.crud.Security;

import com.backendtest.crud.Configuration.JwtTokenProvider;
import com.backendtest.crud.Service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        try{
            // Endpoints que no requieren autenticacion
            if (request.getRequestURI().startsWith("/api/auth/") ||
                    request.getRequestURI().startsWith("/api/users/register")) {
                // si la peticion es a /api/auth/ o /api/users/register, no se requiere autenticacion
                filterChain.doFilter(request, response);
                return;

            }

            // obtenemos el token de la cabecera Authorization
            String jwt = getJwtFromRequest(request);

            if (jwt == null) {
                // si no hay token, continuamos con la cadena de filtros
                filterChain.doFilter(request, response);
                return;
            }

            // comprobamos si el token es valido

            if (!jwtTokenProvider.validateToken(jwt)) {
                System.out.println("Token invalido o expirado");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write(
                        "{\"status\":401,\"message\":\"Token invalido o expirado\"}"
                );
                return; // si el token es invalido, no continuamos con la cadena de filtros
            }
            // obtenemos el username
            String username = jwtTokenProvider.getUsernameFromToken(jwt);
            // cargamos los detalles del usuario
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // creamos un objeto de autenticacion
            // y lo seteamos en el contexto de seguridad
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );

            // seteamos el contexto de seguridad con la autenticacion
            // el usuario es autenticado dentro de la aplicacion
            // y no se necesita volver a autenticar en cada peticion
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }


        catch (Exception e) {
            // Esto asegura que el error se propague correctamente
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(
                    "{" +
                            "\"status\": 401, " +
                            "\"message\": \"Error al procesar el token: " + e.getMessage() + "\"" +
                            "}"
            );
        }
        // el filtro continua con la siguiente cadena de filtros
        filterChain.doFilter(request, response); // esto permite que siga norma
    }

    // metodo para obtener el token de la cabecera Authorization
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        // comprobamos que si el token empieza con "Bearer "
        // se lo quitamos y devolvemos el token
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        // si no hay token, devolvemos null
        return null;
    }


}

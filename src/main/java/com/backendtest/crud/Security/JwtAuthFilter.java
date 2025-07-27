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
        //
        try {
            // obtenemos el token de la cabecera Authorization
            String jwt = getJwtFromRequest(request);

            // comprobamos si el token es valido
            if (jwt != null && jwtTokenProvider.validateToken(jwt)) {
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
        } catch (Exception e) {
            logger.error("No se puede autenticar el usuario", e);
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

package com.backendtest.crud.Repository;

// con el reposotirorio podremos hacer las operaciones CRUD
// del modelo/entidad User
// esto lo hacemos con la ayuda de spring data jpa

import com.backendtest.crud.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);

    // metoodos para username
    boolean existsByUsernameIgnoreCase(String username);
    User findByUsernameIgnoreCase(String username);

    // Nuevos metodos para email
    boolean existsByEmailIgnoreCase(String email);
    User findByEmailIgnoreCase(String email);
}
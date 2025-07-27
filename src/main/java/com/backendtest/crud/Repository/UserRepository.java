package com.backendtest.crud.Repository;

// con el reposotirorio podremos hacer las operaciones CRUD
// del modelo/entidad User
// esto lo hacemos con la ayuda de spring data jpa

import com.backendtest.crud.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// aca lo que hacemos es extender de JpaRepository
// tomamos User como entidad y Long como tipo de dato del id
// esto nos dara a los metodos CRUD basicos
public interface  UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    // Buscamos un usuario por su email
    User findByEmail(String email);
}
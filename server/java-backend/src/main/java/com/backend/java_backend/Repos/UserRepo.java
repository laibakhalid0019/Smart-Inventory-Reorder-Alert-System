package com.backend.java_backend.Repos;

import com.backend.java_backend.Classes.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<User,Integer> {

    User findByUsername(String username);
    User findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    User findById(Long id);
    List<User> findAllByRole(User.Role role);
}

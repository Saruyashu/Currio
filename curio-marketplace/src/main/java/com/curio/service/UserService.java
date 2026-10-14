package com.curio.service;

import com.curio.dao.UserDAO;
import com.curio.model.User;
import com.curio.util.PasswordUtil;
import com.curio.util.ValidationUtil;

import java.sql.SQLException;

public class UserService {
    private final UserDAO userDAO = new UserDAO();

    public User authenticate(String usernameOrEmail, String plainPassword) throws SQLException {
        if (usernameOrEmail == null || plainPassword == null) return null;

        User user = null;
        if (usernameOrEmail.contains("@")) {
            user = userDAO.findByEmail(usernameOrEmail.trim().toLowerCase());
        } else {
            user = userDAO.findByUsername(usernameOrEmail.trim());
        }

        if (user != null && "ACTIVE".equalsIgnoreCase(user.getStatus())) {
            if (PasswordUtil.verifyPassword(plainPassword, user.getPasswordHash())) {
                return user;
            }
        }
        return null;
    }

    public User register(String username, String email, String password, String firstName, String lastName, String phone) throws Exception {
        if (!ValidationUtil.isValidUsername(username)) {
            throw new IllegalArgumentException("Username must be between 3 and 30 alphanumeric characters.");
        }
        if (!ValidationUtil.isValidEmail(email)) {
            throw new IllegalArgumentException("Please provide a valid email address.");
        }
        if (!ValidationUtil.isValidPassword(password)) {
            throw new IllegalArgumentException("Password must be at least 6 characters.");
        }

        if (userDAO.findByUsername(username) != null) {
            throw new IllegalArgumentException("Username is already taken.");
        }
        if (userDAO.findByEmail(email) != null) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        User user = new User();
        user.setUsername(username.trim());
        user.setEmail(email.trim().toLowerCase());
        user.setPasswordHash(PasswordUtil.hashPassword(password));
        user.setFirstName(ValidationUtil.sanitize(firstName));
        user.setLastName(ValidationUtil.sanitize(lastName));
        user.setPhone(phone != null ? phone.trim() : null);
        user.setRole("USER");
        user.setStatus("ACTIVE");

        Long id = userDAO.create(user);
        user.setId(id);
        return user;
    }

    public User getUserById(Long id) throws SQLException {
        return userDAO.findById(id);
    }
}

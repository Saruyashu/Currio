package com.curio.util;

import at.favre.lib.crypto.bcrypt.BCrypt;

public class PasswordUtil {
    private static final int COST = 12;

    /**
     * Hashes a raw password with BCrypt and secure random salt.
     */
    public static String hashPassword(String plainPassword) {
        if (plainPassword == null || plainPassword.isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        return BCrypt.withDefaults().hashToString(COST, plainPassword.toCharArray());
    }

    /**
     * Verifies a plain password against a stored BCrypt hash.
     */
    public static boolean verifyPassword(String plainPassword, String hashedPassword) {
        if (plainPassword == null || hashedPassword == null) {
            return false;
        }
        BCrypt.Result result = BCrypt.verifyer().verify(plainPassword.toCharArray(), hashedPassword);
        return result.verified;
    }
}

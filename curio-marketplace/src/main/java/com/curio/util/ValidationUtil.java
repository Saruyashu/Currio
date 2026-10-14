package com.curio.util;

import java.math.BigDecimal;
import java.util.regex.Pattern;

public class ValidationUtil {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[a-zA-Z0-9_]{3,30}$");

    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    public static boolean isValidUsername(String username) {
        return username != null && USERNAME_PATTERN.matcher(username.trim()).matches();
    }

    public static boolean isValidPassword(String password) {
        return password != null && password.length() >= 6;
    }

    public static boolean isValidBid(BigDecimal bidAmount, BigDecimal currentPrice, BigDecimal increment) {
        if (bidAmount == null || currentPrice == null) {
            return false;
        }
        BigDecimal minRequired = currentPrice.add(increment != null ? increment : new BigDecimal("50.00"));
        return bidAmount.compareTo(minRequired) >= 0;
    }

    /**
     * Prevents XSS attacks by escaping dangerous HTML characters.
     */
    public static String sanitize(String input) {
        if (input == null) return "";
        return input.trim()
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;");
    }
}

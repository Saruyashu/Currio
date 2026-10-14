package com.curio;

import com.curio.util.ValidationUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class AuctionServiceTest {

    @Test
    @DisplayName("Verify bid validation enforces minimum increment")
    void testBidValidationWithIncrement() {
        BigDecimal currentPrice = new BigDecimal("1000.00");
        BigDecimal increment = new BigDecimal("50.00");

        // Below minimum
        assertFalse(ValidationUtil.isValidBid(new BigDecimal("1020.00"), currentPrice, increment),
                "Bid of 1020 must be rejected when minimum required is 1050");

        // Exactly minimum required
        assertTrue(ValidationUtil.isValidBid(new BigDecimal("1050.00"), currentPrice, increment),
                "Bid of 1050 should be accepted");

        // Above minimum required
        assertTrue(ValidationUtil.isValidBid(new BigDecimal("1200.00"), currentPrice, increment),
                "Bid of 1200 should be accepted");
    }

    @Test
    @DisplayName("Verify XSS sanitizer escapes dangerous HTML payloads")
    void testXssSanitizer() {
        String dangerousInput = "<script>alert('pwned')</script>";
        String sanitized = ValidationUtil.sanitize(dangerousInput);
        assertFalse(sanitized.contains("<script>"), "Sanitized string should not contain unescaped script tag");
        assertTrue(sanitized.contains("&lt;script&gt;"), "Sanitized string must escape bracket entities");
    }

    @Test
    @DisplayName("Verify username and email format validation")
    void testUserValidation() {
        assertTrue(ValidationUtil.isValidUsername("sarvesh_99"));
        assertFalse(ValidationUtil.isValidUsername("ab")); // Too short
        assertFalse(ValidationUtil.isValidUsername("bad-user!")); // Disallowed characters

        assertTrue(ValidationUtil.isValidEmail("collector@curio.art"));
        assertFalse(ValidationUtil.isValidEmail("invalid-email-string"));
    }
}

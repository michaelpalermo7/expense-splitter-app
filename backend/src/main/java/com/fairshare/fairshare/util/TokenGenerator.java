package com.fairshare.fairshare.util;

import java.security.SecureRandom;
import java.util.Base64;

public final class TokenGenerator {
    private static final SecureRandom RNG = new SecureRandom();

    private TokenGenerator() {
    }

    // 128 bits
    public static String newInviteToken() {
        byte[] bytes = new byte[16];
        RNG.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
package com.fairshare.fairshare.dto;

import java.math.BigDecimal;

public record ShareDTO(
        Long membershipId,
        BigDecimal shareAmount,
        BigDecimal shareRatio) {
}

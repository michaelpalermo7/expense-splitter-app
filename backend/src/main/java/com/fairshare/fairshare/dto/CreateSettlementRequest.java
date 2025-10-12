package com.fairshare.fairshare.dto;

import java.math.BigDecimal;

import com.fairshare.fairshare.entity.Settlement;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateSettlementRequest(
                @Email @NotNull String payerEmail,
                @Email @NotNull String payeeEmail,
                @NotNull @Positive BigDecimal amount,
                Settlement.CurrencyCode currency // optional; defaults in service
) {
}

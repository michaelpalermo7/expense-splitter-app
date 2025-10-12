package com.fairshare.fairshare.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.fairshare.fairshare.entity.Expense;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateExpenseRequest(
                String payerEmail,
                @NotNull @Positive BigDecimal amount,
                Expense.CurrencyCode currency,
                String description,
                Instant occurredAt) {
}
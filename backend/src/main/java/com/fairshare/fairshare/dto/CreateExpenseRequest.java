package com.fairshare.fairshare.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

import com.fairshare.fairshare.entity.Expense;
import com.fairshare.fairshare.entity.SplitMode;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateExpenseRequest(
                @NotNull Long payerMembershipId,
                @NotNull @Positive BigDecimal amount,
                Expense.CurrencyCode currency,
                String description,
                Instant occurredAt,
                Long[] participantMembershipIds,
                SplitMode splitMode,
                Map<Long, BigDecimal> splitValues) {
}
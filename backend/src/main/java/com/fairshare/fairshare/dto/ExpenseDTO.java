package com.fairshare.fairshare.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.fairshare.fairshare.entity.Expense;
import com.fairshare.fairshare.entity.SplitMode;

public record ExpenseDTO(
        Long expenseId,
        Long groupId,
        Long payerMembershipId,
        BigDecimal amount,
        Expense.CurrencyCode currency,
        String description,
        Instant occurredAt,
        Instant createdAt,
        SplitMode splitMode,
        List<ShareDTO> shares) {
}

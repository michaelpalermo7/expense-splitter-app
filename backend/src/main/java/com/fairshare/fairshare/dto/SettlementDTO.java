package com.fairshare.fairshare.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.fairshare.fairshare.entity.Settlement;

public record SettlementDTO(
                Long settlementId,
                Long payerMembershipId,
                Long payeeMembershipId,
                Long groupId,
                BigDecimal amount,
                Settlement.CurrencyCode currency,
                Instant settledAt) {
}

package com.fairshare.fairshare.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fairshare.fairshare.dto.BalanceDTO;
import com.fairshare.fairshare.dto.ExpenseDTO;
import com.fairshare.fairshare.dto.SettlementDTO;
import com.fairshare.fairshare.entity.Expense;
import com.fairshare.fairshare.entity.ExpenseShare;
import com.fairshare.fairshare.entity.Group;
import com.fairshare.fairshare.entity.Membership;
import com.fairshare.fairshare.entity.Settlement;
import com.fairshare.fairshare.repository.ExpenseRepository;
import com.fairshare.fairshare.repository.ExpenseShareRepository;
import com.fairshare.fairshare.repository.GroupRepository;
import com.fairshare.fairshare.repository.MembershipRepository;
import com.fairshare.fairshare.repository.SettlementRepository;
import com.fairshare.fairshare.service.ExpenseService;

@ExtendWith(MockitoExtension.class)
public class ExpenseServiceTest {

    @Mock
    ExpenseRepository expenseRepository;
    @Mock
    ExpenseShareRepository expenseShareRepository;
    @Mock
    MembershipRepository membershipRepository;
    @Mock
    GroupRepository groupRepository;
    @Mock
    SettlementRepository settlementRepository;

    @InjectMocks
    ExpenseService expenseService;

    /* ==== helpers ==== */
    private static Group group(long id, String name) {
        Group g = new Group();
        g.setGroupId(id);
        g.setGroupName(name);
        return g;
    }

    private static Membership member(long membershipId, String displayName, Group g) {
        Membership m = new Membership();
        m.setMembershipId(membershipId);
        m.setDisplayName(displayName);
        m.setGroup(g);
        return m;
    }

    /* ==== tests ==== */

    @Test
    void createExpense_createsExpense_andSplitsEqually() throws Exception {
        Long groupId = 1L;
        Long payerMembershipId = 10L;

        Group g = group(groupId, "Lunch");
        Membership alice = member(payerMembershipId, "Alice", g);
        Membership bob = member(20L, "Bob", g);

        // group exists
        when(groupRepository.existsById(groupId)).thenReturn(true);
        // payer membership exists and belongs to the group
        when(membershipRepository.findById(payerMembershipId)).thenReturn(java.util.Optional.of(alice));

        // group members (for equal split)
        when(membershipRepository.findByGroup_GroupId(groupId))
                .thenReturn(List.of(alice, bob));

        // persisted expense
        Expense saved = new Expense();
        saved.setExpenseId(100L);
        saved.setGroup(g);
        saved.setPayer(alice);
        saved.setAmount(new BigDecimal("30.00"));
        saved.setCurrency(Expense.CurrencyCode.CAD);
        saved.setDescription("Pizza");
        saved.setOccurredAt(Instant.parse("2025-01-01T00:00:00Z"));

        when(groupRepository.getReferenceById(groupId)).thenReturn(g);
        when(expenseRepository.save(any(Expense.class))).thenReturn(saved);
        when(expenseShareRepository.save(any(ExpenseShare.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        ExpenseDTO dto = expenseService.createExpense(
                groupId,
                payerMembershipId,
                new BigDecimal("30.00"),
                Expense.CurrencyCode.CAD,
                "Pizza",
                Instant.parse("2025-01-01T00:00:00Z"));

        // Assert
        assertEquals(100L, dto.expenseId());
        assertEquals(groupId, dto.groupId());
        assertEquals(payerMembershipId, dto.payerMembershipId());
        assertEquals(new BigDecimal("30.00"), dto.amount());
        assertEquals(2, dto.shares().size());

        var perShare = new BigDecimal("30.00").divide(new BigDecimal("2"), 2, RoundingMode.HALF_UP);
        assertTrue(dto.shares().stream().allMatch(s -> s.shareAmount().compareTo(perShare) == 0));
        verify(expenseShareRepository, times(2)).save(any(ExpenseShare.class));
    }

    @Test
    void getUserBalances_computesNetBalancesCorrectly() throws Exception {
        Long groupId = 1L;
        Group g = group(groupId, "Trip");
        Membership alice = member(10L, "Alice", g);
        Membership bob = member(20L, "Bob", g);

        when(groupRepository.existsById(groupId)).thenReturn(true);
        when(membershipRepository.findByGroup_GroupId(groupId)).thenReturn(List.of(alice, bob));

        Expense exp = new Expense();
        exp.setExpenseId(100L);
        exp.setGroup(g);
        exp.setPayer(alice);
        exp.setAmount(new BigDecimal("20.00"));
        exp.setCurrency(Expense.CurrencyCode.CAD);
        exp.setDescription("Snacks");
        exp.setOccurredAt(Instant.parse("2025-01-01T00:00:00Z"));
        when(expenseRepository.findByGroup_GroupId(groupId)).thenReturn(List.of(exp));

        ExpenseShare aliceShare = new ExpenseShare();
        aliceShare.setExpense(exp);
        aliceShare.setMembership(alice);
        aliceShare.setShareAmount(new BigDecimal("10.00"));

        ExpenseShare bobShare = new ExpenseShare();
        bobShare.setExpense(exp);
        bobShare.setMembership(bob);
        bobShare.setShareAmount(new BigDecimal("10.00"));

        when(expenseShareRepository.findByExpense_Group_GroupId(groupId))
                .thenReturn(List.of(aliceShare, bobShare));

        // Act
        List<BalanceDTO> balances = expenseService.getUserBalances(groupId);

        // Assert
        assertEquals(2, balances.size(), "Should return one balance per member");

        var aliceBal = balances.stream().filter(b -> b.membershipId().equals(10L)).findFirst().orElseThrow();
        var bobBal = balances.stream().filter(b -> b.membershipId().equals(20L)).findFirst().orElseThrow();

        assertEquals(new BigDecimal("10.00"), aliceBal.balance(), "Alice should be owed 10");
        assertEquals(new BigDecimal("-10.00"), bobBal.balance(), "Bob should owe 10");
    }

    @Test
    void createSettlement_persistsSettlement_andReturnsDTO() throws Exception {
        Long groupId = 1L;
        Long payerMembershipId = 10L;
        Long payeeMembershipId = 20L;
        BigDecimal amount = new BigDecimal("25.00");

        Group g = group(groupId, "Club");
        Membership payer = member(payerMembershipId, "Alice", g);
        Membership payee = member(payeeMembershipId, "Bob", g);

        when(groupRepository.existsById(groupId)).thenReturn(true);
        when(membershipRepository.findById(payerMembershipId)).thenReturn(java.util.Optional.of(payer));
        when(membershipRepository.findById(payeeMembershipId)).thenReturn(java.util.Optional.of(payee));
        when(groupRepository.getReferenceById(groupId)).thenReturn(g);

        Settlement saved = new Settlement();
        saved.setSettlementId(500L);
        saved.setPayer(payer);
        saved.setPayee(payee);
        saved.setGroup(g);
        saved.setAmount(amount);
        saved.setCurrency(Settlement.CurrencyCode.CAD);
        saved.setSettledAt(Instant.parse("2025-03-03T00:00:00Z"));

        when(settlementRepository.save(any(Settlement.class))).thenReturn(saved);

        // Act
        SettlementDTO dto = expenseService.createSettlement(
                groupId,
                payerMembershipId,
                payeeMembershipId,
                amount,
                Settlement.CurrencyCode.CAD);

        // Assert
        assertEquals(500L, dto.settlementId());
        assertEquals(payerMembershipId, dto.payerMembershipId());
        assertEquals(payeeMembershipId, dto.payeeMembershipId());
        assertEquals(groupId, dto.groupId());
        assertEquals(new BigDecimal("25.00"), dto.amount());
        assertEquals(Settlement.CurrencyCode.CAD, dto.currency());
        assertEquals(Instant.parse("2025-03-03T00:00:00Z"), dto.settledAt());

        verify(settlementRepository, times(1)).save(any(Settlement.class));
    }
}

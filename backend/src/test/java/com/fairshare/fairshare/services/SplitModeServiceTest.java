package com.fairshare.fairshare.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fairshare.fairshare.dto.ExpenseDTO;
import com.fairshare.fairshare.entity.Expense;
import com.fairshare.fairshare.entity.ExpenseShare;
import com.fairshare.fairshare.entity.Group;
import com.fairshare.fairshare.entity.Membership;
import com.fairshare.fairshare.entity.SplitMode;
import com.fairshare.fairshare.repository.ExpenseRepository;
import com.fairshare.fairshare.repository.ExpenseShareRepository;
import com.fairshare.fairshare.repository.GroupRepository;
import com.fairshare.fairshare.repository.MembershipRepository;
import com.fairshare.fairshare.repository.SettlementRepository;
import com.fairshare.fairshare.service.ExpenseService;

@ExtendWith(MockitoExtension.class)
public class SplitModeServiceTest {

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

    private void stubCommon(Long groupId, Group g, Membership payer, List<Membership> participants) {
        when(groupRepository.existsById(groupId)).thenReturn(true);
        when(membershipRepository.findById(payer.getMembershipId()))
                .thenReturn(java.util.Optional.of(payer));
        when(membershipRepository.findAllById(any())).thenReturn(participants);
        lenient().when(groupRepository.getReferenceById(groupId)).thenReturn(g);

        Expense saved = new Expense();
        saved.setExpenseId(1L);
        saved.setGroup(g);
        saved.setPayer(payer);
        saved.setAmount(new BigDecimal("60.00"));
        saved.setCurrency(Expense.CurrencyCode.CAD);
        saved.setOccurredAt(Instant.parse("2025-06-01T00:00:00Z"));
        lenient().when(expenseRepository.save(any(Expense.class))).thenReturn(saved);
        lenient().when(expenseShareRepository.save(any(ExpenseShare.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    /* ==== tests ==== */

    @Test
    void exactSplit_throwsWhenSumDoesNotMatchAmount() {
        Long groupId = 1L;
        Group g = group(groupId, "Test");
        Membership alice = member(10L, "Alice", g);
        Membership bob = member(20L, "Bob", g);

        stubCommon(groupId, g, alice, List.of(alice, bob));

        // Values sum to 50, but amount is 60
        Map<Long, BigDecimal> splitValues = Map.of(
                10L, new BigDecimal("30.00"),
                20L, new BigDecimal("20.00"));

        assertThrows(IllegalArgumentException.class, () ->
                expenseService.createExpense(
                        groupId, 10L, new BigDecimal("60.00"),
                        Expense.CurrencyCode.CAD, "Test", Instant.now(),
                        SplitMode.EXACT, splitValues, 10L, 20L));
    }

    @Test
    void percentageSplit_throwsWhenNotSumTo100() {
        Long groupId = 1L;
        Group g = group(groupId, "Test");
        Membership alice = member(10L, "Alice", g);
        Membership bob = member(20L, "Bob", g);

        stubCommon(groupId, g, alice, List.of(alice, bob));

        // Percentages sum to 90, not 100
        Map<Long, BigDecimal> splitValues = Map.of(
                10L, new BigDecimal("50.00"),
                20L, new BigDecimal("40.00"));

        assertThrows(IllegalArgumentException.class, () ->
                expenseService.createExpense(
                        groupId, 10L, new BigDecimal("60.00"),
                        Expense.CurrencyCode.CAD, "Test", Instant.now(),
                        SplitMode.PERCENTAGE, splitValues, 10L, 20L));
    }

    @Test
    void sharesSplit_computesProportionalAmountsWithRounding() throws Exception {
        Long groupId = 1L;
        Group g = group(groupId, "Test");
        Membership alice = member(10L, "Alice", g);
        Membership bob = member(20L, "Bob", g);
        Membership carol = member(30L, "Carol", g);

        stubCommon(groupId, g, alice, List.of(alice, bob, carol));

        // Override the saved expense to have amount 10.00
        Expense saved = new Expense();
        saved.setExpenseId(1L);
        saved.setGroup(g);
        saved.setPayer(alice);
        saved.setAmount(new BigDecimal("10.00"));
        saved.setCurrency(Expense.CurrencyCode.CAD);
        saved.setOccurredAt(Instant.parse("2025-06-01T00:00:00Z"));
        when(expenseRepository.save(any(Expense.class))).thenReturn(saved);

        // 1:1:1 shares on $10 => each gets $3.33 (HALF_UP)
        Map<Long, BigDecimal> splitValues = Map.of(
                10L, new BigDecimal("1"),
                20L, new BigDecimal("1"),
                30L, new BigDecimal("1"));

        ExpenseDTO dto = expenseService.createExpense(
                groupId, 10L, new BigDecimal("10.00"),
                Expense.CurrencyCode.CAD, "Test", Instant.now(),
                SplitMode.SHARES, splitValues, 10L, 20L, 30L);

        assertEquals(3, dto.shares().size());
        BigDecimal expected = new BigDecimal("10.00")
                .divide(new BigDecimal("3"), 2, RoundingMode.HALF_UP);
        assertTrue(dto.shares().stream()
                .allMatch(s -> s.shareAmount().compareTo(expected) == 0));
    }

    @Test
    void equalSplit_worksWithNullSplitMode_backwardCompat() throws Exception {
        Long groupId = 1L;
        Group g = group(groupId, "Test");
        Membership alice = member(10L, "Alice", g);
        Membership bob = member(20L, "Bob", g);

        when(groupRepository.existsById(groupId)).thenReturn(true);
        when(membershipRepository.findById(10L)).thenReturn(java.util.Optional.of(alice));
        when(membershipRepository.findByGroup_GroupId(groupId)).thenReturn(List.of(alice, bob));
        when(groupRepository.getReferenceById(groupId)).thenReturn(g);

        Expense saved = new Expense();
        saved.setExpenseId(1L);
        saved.setGroup(g);
        saved.setPayer(alice);
        saved.setAmount(new BigDecimal("20.00"));
        saved.setCurrency(Expense.CurrencyCode.CAD);
        saved.setOccurredAt(Instant.parse("2025-06-01T00:00:00Z"));
        when(expenseRepository.save(any(Expense.class))).thenReturn(saved);
        when(expenseShareRepository.save(any(ExpenseShare.class))).thenAnswer(inv -> inv.getArgument(0));

        // Call the backward-compat overload (no splitMode, no splitValues)
        ExpenseDTO dto = expenseService.createExpense(
                groupId, 10L, new BigDecimal("20.00"),
                Expense.CurrencyCode.CAD, "Pizza", Instant.now());

        assertEquals(2, dto.shares().size());
        assertEquals(SplitMode.EQUAL, dto.splitMode());
        assertTrue(dto.shares().stream()
                .allMatch(s -> s.shareAmount().compareTo(new BigDecimal("10.00")) == 0));
    }
}

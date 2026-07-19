package com.fairshare.fairshare.integration;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.fairshare.fairshare.dto.BalanceDTO;
import com.fairshare.fairshare.dto.ExpenseDTO;
import com.fairshare.fairshare.entity.Expense;
import com.fairshare.fairshare.entity.Group;
import com.fairshare.fairshare.entity.Membership;
import com.fairshare.fairshare.entity.SplitMode;
import com.fairshare.fairshare.repository.GroupRepository;
import com.fairshare.fairshare.repository.MembershipRepository;
import com.fairshare.fairshare.service.ExpenseService;

@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
class SplitModeFlowIT {

    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    GroupRepository groupRepository;
    @Autowired
    MembershipRepository membershipRepository;
    @Autowired
    ExpenseService expenseService;

    private Group group;
    private Membership alice;
    private Membership bob;
    private Membership carol;

    @BeforeEach
    void setUp() {
        group = new Group();
        group.setGroupName("SplitModeTest");
        group.setInviteToken(UUID.randomUUID().toString().replace("-", ""));
        group = groupRepository.save(group);

        alice = new Membership();
        alice.setDisplayName("Alice");
        alice.setGroup(group);
        alice = membershipRepository.save(alice);

        bob = new Membership();
        bob.setDisplayName("Bob");
        bob.setGroup(group);
        bob = membershipRepository.save(bob);

        carol = new Membership();
        carol.setDisplayName("Carol");
        carol.setGroup(group);
        carol = membershipRepository.save(carol);
    }

    @Test
    void equalSplit_dividesEvenly() throws Exception {
        ExpenseDTO dto = expenseService.createExpense(
                group.getGroupId(),
                alice.getMembershipId(),
                new BigDecimal("30.00"),
                Expense.CurrencyCode.CAD,
                "Lunch",
                Instant.now(),
                SplitMode.EQUAL,
                null,
                alice.getMembershipId(), bob.getMembershipId(), carol.getMembershipId());

        assertThat(dto.splitMode()).isEqualTo(SplitMode.EQUAL);
        assertThat(dto.shares()).hasSize(3);
        assertThat(dto.shares().stream().map(s -> s.shareAmount()))
                .allMatch(a -> a.compareTo(new BigDecimal("10.00")) == 0);
    }

    @Test
    void exactSplit_usesSpecifiedAmounts() throws Exception {
        Map<Long, BigDecimal> splitValues = Map.of(
                alice.getMembershipId(), new BigDecimal("10.00"),
                bob.getMembershipId(), new BigDecimal("15.00"),
                carol.getMembershipId(), new BigDecimal("5.00"));

        ExpenseDTO dto = expenseService.createExpense(
                group.getGroupId(),
                alice.getMembershipId(),
                new BigDecimal("30.00"),
                Expense.CurrencyCode.CAD,
                "Dinner",
                Instant.now(),
                SplitMode.EXACT,
                splitValues,
                alice.getMembershipId(), bob.getMembershipId(), carol.getMembershipId());

        assertThat(dto.splitMode()).isEqualTo(SplitMode.EXACT);
        assertThat(dto.shares()).hasSize(3);

        var shareMap = dto.shares().stream()
                .collect(java.util.stream.Collectors.toMap(s -> s.membershipId(), s -> s.shareAmount()));
        assertThat(shareMap.get(alice.getMembershipId())).isEqualByComparingTo("10.00");
        assertThat(shareMap.get(bob.getMembershipId())).isEqualByComparingTo("15.00");
        assertThat(shareMap.get(carol.getMembershipId())).isEqualByComparingTo("5.00");
    }

    @Test
    void percentageSplit_computesCorrectAmounts() throws Exception {
        Map<Long, BigDecimal> splitValues = Map.of(
                alice.getMembershipId(), new BigDecimal("50.00"),
                bob.getMembershipId(), new BigDecimal("30.00"),
                carol.getMembershipId(), new BigDecimal("20.00"));

        ExpenseDTO dto = expenseService.createExpense(
                group.getGroupId(),
                alice.getMembershipId(),
                new BigDecimal("100.00"),
                Expense.CurrencyCode.CAD,
                "Hotel",
                Instant.now(),
                SplitMode.PERCENTAGE,
                splitValues,
                alice.getMembershipId(), bob.getMembershipId(), carol.getMembershipId());

        assertThat(dto.splitMode()).isEqualTo(SplitMode.PERCENTAGE);
        assertThat(dto.shares()).hasSize(3);

        var shareMap = dto.shares().stream()
                .collect(java.util.stream.Collectors.toMap(s -> s.membershipId(), s -> s.shareAmount()));
        assertThat(shareMap.get(alice.getMembershipId())).isEqualByComparingTo("50.00");
        assertThat(shareMap.get(bob.getMembershipId())).isEqualByComparingTo("30.00");
        assertThat(shareMap.get(carol.getMembershipId())).isEqualByComparingTo("20.00");
    }

    @Test
    void sharesSplit_computesProportionally() throws Exception {
        Map<Long, BigDecimal> splitValues = Map.of(
                alice.getMembershipId(), new BigDecimal("2"),
                bob.getMembershipId(), new BigDecimal("1"),
                carol.getMembershipId(), new BigDecimal("1"));

        ExpenseDTO dto = expenseService.createExpense(
                group.getGroupId(),
                alice.getMembershipId(),
                new BigDecimal("40.00"),
                Expense.CurrencyCode.CAD,
                "Groceries",
                Instant.now(),
                SplitMode.SHARES,
                splitValues,
                alice.getMembershipId(), bob.getMembershipId(), carol.getMembershipId());

        assertThat(dto.splitMode()).isEqualTo(SplitMode.SHARES);
        assertThat(dto.shares()).hasSize(3);

        var shareMap = dto.shares().stream()
                .collect(java.util.stream.Collectors.toMap(s -> s.membershipId(), s -> s.shareAmount()));
        assertThat(shareMap.get(alice.getMembershipId())).isEqualByComparingTo("20.00");
        assertThat(shareMap.get(bob.getMembershipId())).isEqualByComparingTo("10.00");
        assertThat(shareMap.get(carol.getMembershipId())).isEqualByComparingTo("10.00");
    }

    @Test
    void balances_correctAfterMixedSplitModes() throws Exception {
        // Alice pays 30, equal split among 3 => each owes 10
        expenseService.createExpense(
                group.getGroupId(),
                alice.getMembershipId(),
                new BigDecimal("30.00"),
                Expense.CurrencyCode.CAD,
                "Equal expense",
                Instant.now(),
                SplitMode.EQUAL,
                null,
                alice.getMembershipId(), bob.getMembershipId(), carol.getMembershipId());

        // Bob pays 20, exact split: Alice 5, Bob 5, Carol 10
        expenseService.createExpense(
                group.getGroupId(),
                bob.getMembershipId(),
                new BigDecimal("20.00"),
                Expense.CurrencyCode.CAD,
                "Exact expense",
                Instant.now(),
                SplitMode.EXACT,
                Map.of(
                        alice.getMembershipId(), new BigDecimal("5.00"),
                        bob.getMembershipId(), new BigDecimal("5.00"),
                        carol.getMembershipId(), new BigDecimal("10.00")),
                alice.getMembershipId(), bob.getMembershipId(), carol.getMembershipId());

        List<BalanceDTO> balances = expenseService.getUserBalances(group.getGroupId());
        assertThat(balances).hasSize(3);

        var balMap = balances.stream()
                .collect(java.util.stream.Collectors.toMap(BalanceDTO::membershipId, BalanceDTO::balance));

        // Alice: paid 30, owes (10+5)=15 => net +15
        // Bob: paid 20, owes (10+5)=15 => net +5
        // Carol: paid 0, owes (10+10)=20 => net -20
        assertThat(balMap.get(alice.getMembershipId())).isEqualByComparingTo("15.00");
        assertThat(balMap.get(bob.getMembershipId())).isEqualByComparingTo("5.00");
        assertThat(balMap.get(carol.getMembershipId())).isEqualByComparingTo("-20.00");
    }
}

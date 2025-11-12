package com.fairshare.fairshare.integration;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
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
import com.fairshare.fairshare.repository.GroupRepository;
import com.fairshare.fairshare.repository.MembershipRepository;
import com.fairshare.fairshare.service.ExpenseService;

@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
class ExpenseFlowIT {

    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    GroupRepository groupRepository;
    @Autowired
    MembershipRepository membershipRepository;
    @Autowired
    ExpenseService expenseService;

    @Test
    void createExpense_andComputeBalances_endToEnd() throws Exception {
        // create group
        Group g = new Group();
        g.setGroupName("Trip");
        g = groupRepository.save(g);

        // add memberships (Alice, Bob)
        Membership alice = new Membership();
        alice.setDisplayName("Alice");
        alice.setGroup(g);

        Membership bob = new Membership();
        bob.setDisplayName("Bob");
        bob.setGroup(g);

        alice = membershipRepository.save(alice);
        bob = membershipRepository.save(bob);

        // create an expense via service (Alice pays 40)
        ExpenseDTO expense = expenseService.createExpense(
                g.getGroupId(),
                alice.getMembershipId(),
                new BigDecimal("40.00"),
                Expense.CurrencyCode.CAD,
                "Dinner",
                Instant.now());

        assertThat(expense.expenseId()).isNotNull();
        assertThat(expense.shares()).hasSize(2);

        // compute balances via service
        List<BalanceDTO> balances = expenseService.getUserBalances(g.getGroupId());
        Map<Long, BigDecimal> map = balances.stream()
                .collect(java.util.stream.Collectors.toMap(BalanceDTO::membershipId, BalanceDTO::balance));

        // expected: +20 for Alice (owed), -20 for Bob (owes)
        assertThat(map.get(alice.getMembershipId())).isEqualByComparingTo("20.00");
        assertThat(map.get(bob.getMembershipId())).isEqualByComparingTo("-20.00");
    }
}

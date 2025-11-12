package com.fairshare.fairshare.integration;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.fairshare.fairshare.dto.BalanceDTO;
import com.fairshare.fairshare.dto.ExpenseDTO;
import com.fairshare.fairshare.dto.GroupDTO;
import com.fairshare.fairshare.dto.MembershipDTO;
import com.fairshare.fairshare.entity.Expense;
import com.fairshare.fairshare.repository.ExpenseRepository;
import com.fairshare.fairshare.repository.GroupRepository;
import com.fairshare.fairshare.repository.MembershipRepository;
import com.fairshare.fairshare.service.ExpenseService;
import com.fairshare.fairshare.service.GroupService;

@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
@DirtiesContext
class HappyPathFlowIT {

        @ServiceConnection
        static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

        @Autowired
        GroupRepository groupRepository;
        @Autowired
        MembershipRepository membershipRepository;
        @Autowired
        ExpenseRepository expenseRepository;

        @Autowired
        GroupService groupService;
        @Autowired
        ExpenseService expenseService;

        @Test
        void fullFlow_createGroup_addMembers_createExpense_balances_delete() throws Exception {
                // create group
                GroupDTO groupDto = groupService.createGroup("Trip");
                Long groupId = groupDto.groupId();

                // add members by name
                MembershipDTO alice = groupService.addMemberByName(groupId, "Alice");
                MembershipDTO bob = groupService.addMemberByName(groupId, "Bob");

                // group has 2 members
                List<MembershipDTO> allMembers = groupService.listAllMembers(groupId);
                assertThat(allMembers).extracting(MembershipDTO::displayName)
                                .containsExactlyInAnyOrder("Alice", "Bob");

                // create an expense (Alice pays $40, equal split)
                ExpenseDTO expense = expenseService.createExpense(
                                groupId,
                                alice.membershipId(),
                                new BigDecimal("40.00"),
                                Expense.CurrencyCode.CAD,
                                "Dinner",
                                Instant.parse("2025-01-01T00:00:00Z"));
                assertThat(expense.expenseId()).isNotNull();
                assertThat(expense.shares()).hasSize(2);
                assertThat(expense.description()).isEqualTo("Dinner");

                // verify balances (+20 Alice, -20 Bob)
                List<BalanceDTO> balances = expenseService.getUserBalances(groupId);
                Map<Long, BigDecimal> balMap = balances.stream()
                                .collect(Collectors.toMap(BalanceDTO::membershipId, BalanceDTO::balance));
                assertThat(balMap.get(alice.membershipId())).isEqualByComparingTo("20.00");
                assertThat(balMap.get(bob.membershipId())).isEqualByComparingTo("-20.00");

                // delete the group
                groupService.deleteGroup(groupId);

                // verify cascade cleanup for that group
                assertThat(groupRepository.findById(groupId)).isEmpty();
                assertThat(membershipRepository.findByGroup_GroupId(groupId)).isEmpty();
                assertThat(expenseRepository.findByGroup_GroupId(groupId)).isEmpty();
        }
}

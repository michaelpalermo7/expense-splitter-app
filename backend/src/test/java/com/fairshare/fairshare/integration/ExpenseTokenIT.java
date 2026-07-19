package com.fairshare.fairshare.integration;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.fairshare.fairshare.dto.BalanceDTO;
import com.fairshare.fairshare.dto.CreateExpenseRequest;
import com.fairshare.fairshare.dto.ExpenseDTO;
import com.fairshare.fairshare.dto.GroupDTO;
import com.fairshare.fairshare.dto.MembershipDTO;
import com.fairshare.fairshare.entity.Expense;
import com.fairshare.fairshare.service.GroupService;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Full end-to-end flow through the token-based routes
 * (similar to how Spliito uses its group links).
 */
@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
@AutoConfigureMockMvc
@DirtiesContext
class ExpenseTokenIT {

        @ServiceConnection
        static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

        @Autowired
        MockMvc mockMvc;
        @Autowired
        ObjectMapper objectMapper;
        @Autowired
        GroupService groupService;

        @Test
        void tokenRoutes_createExpense_andComputeBalances() throws Exception {
                // create group via service
                GroupDTO group = groupService.createGroup("Trip");
                String token = group.inviteToken();

                // add two members
                MembershipDTO alice = groupService.addMemberByName(group.groupId(), "Alice");
                MembershipDTO bob = groupService.addMemberByName(group.groupId(), "Bob");

                // create expense via controller
                CreateExpenseRequest expenseReq = new CreateExpenseRequest(
                                alice.membershipId(),
                                new BigDecimal("40.00"),
                                Expense.CurrencyCode.CAD,
                                "Dinner",
                                Instant.parse("2025-01-01T00:00:00Z"),
                                new Long[] { alice.membershipId(), bob.membershipId() },
                                null,
                                null);

                String expenseBody = objectMapper.writeValueAsString(expenseReq);

                String expenseResp = mockMvc.perform(
                                post("/api/group/{token}/expenses", token)
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(expenseBody))
                                .andExpect(status().isCreated())
                                .andReturn().getResponse().getContentAsString();

                ExpenseDTO expense = objectMapper.readValue(expenseResp, ExpenseDTO.class);
                assertThat(expense.expenseId()).isNotNull();
                assertThat(expense.amount()).isEqualByComparingTo("40.00");
                assertThat(expense.description()).isEqualTo("Dinner");
                assertThat(expense.shares()).hasSize(2);

                // get balances via token route
                String balanceResp = mockMvc.perform(get("/api/group/{token}/balances", token))
                                .andExpect(status().isOk())
                                .andReturn().getResponse().getContentAsString();

                List<BalanceDTO> balances = objectMapper.readValue(
                                balanceResp,
                                objectMapper.getTypeFactory().constructCollectionType(List.class, BalanceDTO.class));

                Map<Long, BigDecimal> balMap = balances.stream()
                                .collect(java.util.stream.Collectors.toMap(BalanceDTO::membershipId,
                                                BalanceDTO::balance));

                // expected: +20 for Alice, -20 for Bob
                assertThat(balMap.get(alice.membershipId())).isEqualByComparingTo("20.00");
                assertThat(balMap.get(bob.membershipId())).isEqualByComparingTo("-20.00");

                // invalid token should 404
                mockMvc.perform(get("/api/group/{token}/balances", "nonexistent"))
                                .andExpect(status().isNotFound());
        }
}

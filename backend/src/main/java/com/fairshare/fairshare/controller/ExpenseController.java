package com.fairshare.fairshare.controller;

import java.util.List;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.fairshare.fairshare.dto.BalanceDTO;
import com.fairshare.fairshare.dto.CreateExpenseRequest;
import com.fairshare.fairshare.dto.CreateSettlementRequest;
import com.fairshare.fairshare.dto.ExpenseDTO;
import com.fairshare.fairshare.dto.SettlementDTO;
import com.fairshare.fairshare.service.ExpenseService;
import com.fairshare.fairshare.service.GroupService;

import jakarta.validation.Valid;

@CrossOrigin("*")
@Validated
@RestController
@RequestMapping("/api/group/{token}")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final GroupService groupService;

    public ExpenseController(ExpenseService expenseService, GroupService groupService) {
        this.expenseService = expenseService;
        this.groupService = groupService;
    }

    private Long groupIdFromToken(String token) throws NotFoundException {
        return groupService.findByInviteToken(token).groupId();
    }

    // ===== Expenses =====

    @PostMapping("/expenses")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public ExpenseDTO createExpense(
            @PathVariable String token,
            @RequestBody @Valid CreateExpenseRequest request) throws Exception {

        return expenseService.createExpense(
                groupIdFromToken(token),
                request.payerMembershipId(),
                request.amount(),
                request.currency(),
                request.description(),
                request.occurredAt(),
                request.participantMembershipIds());
    }

    @GetMapping("/expenses")
    @Transactional(readOnly = true)
    public List<ExpenseDTO> listGroupExpenses(@PathVariable String token) throws Exception {
        return expenseService.listGroupExpenses(groupIdFromToken(token));
    }

    // ===== Balances =====

    @GetMapping("/balances")
    @Transactional(readOnly = true)
    public List<BalanceDTO> getUserBalances(@PathVariable String token) throws Exception {
        return expenseService.getUserBalances(groupIdFromToken(token));
    }

    // ===== Settlements =====

    @PostMapping("/settlements")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public SettlementDTO createSettlement(
            @PathVariable String token,
            @RequestBody @Valid CreateSettlementRequest request) throws Exception {

        return expenseService.createSettlement(
                groupIdFromToken(token),
                request.payerMembershipId(),
                request.payeeMembershipId(),
                request.amount(),
                request.currency());
    }

    @GetMapping("/settlements")
    @Transactional(readOnly = true)
    public List<SettlementDTO> listSettlements(@PathVariable String token) throws Exception {
        return expenseService.listGroupSettlements(groupIdFromToken(token));
    }
}

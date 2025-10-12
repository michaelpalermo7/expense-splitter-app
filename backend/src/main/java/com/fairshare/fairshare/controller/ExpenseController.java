package com.fairshare.fairshare.controller;

import java.util.List;

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
import org.springframework.web.server.ResponseStatusException;

import com.fairshare.fairshare.dto.BalanceDTO;
import com.fairshare.fairshare.dto.CreateExpenseRequest;
import com.fairshare.fairshare.dto.CreateSettlementRequest;
import com.fairshare.fairshare.dto.ExpenseDTO;
import com.fairshare.fairshare.dto.SettlementDTO;
import com.fairshare.fairshare.repository.UserRepository;
import com.fairshare.fairshare.service.ExpenseService;

import jakarta.validation.Valid;

@CrossOrigin("*")
@Validated
@RestController
@RequestMapping("/groups/{groupId}")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserRepository userRepository;

    public ExpenseController(ExpenseService expenseService, UserRepository userRepository) {
        this.expenseService = expenseService;
        this.userRepository = userRepository;
    }

    @PostMapping("/expenses")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public ExpenseDTO createExpense(
            @PathVariable Long groupId,
            @RequestBody @Valid CreateExpenseRequest request) throws Exception {

        // were given email, translate to user ID for service
        var payer = userRepository.findByUserEmail(request.payerEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found for email: " + request.payerEmail()));

        Long payerId = payer.getUserId();

        return expenseService.createExpense(
                groupId,
                payerId,
                request.amount(),
                request.currency(),
                request.description(),
                request.occurredAt());
    }

    @GetMapping("/expenses")
    @Transactional(readOnly = true)
    public List<ExpenseDTO> listGroupExpenses(@PathVariable Long groupId) throws Exception {
        // TODO: pagination/filtering in future
        return expenseService.listGroupExpenses(groupId);
    }

    @GetMapping("/balances")
    @Transactional(readOnly = true)
    public List<BalanceDTO> getUserBalances(@PathVariable Long groupId) throws Exception {
        return expenseService.getUserBalances(groupId);
    }

    @PostMapping("/settlements")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public SettlementDTO createSettlement(
            @PathVariable Long groupId,
            @RequestBody @Valid CreateSettlementRequest request) throws Exception {

        // Look up payer
        var payer = userRepository.findByUserEmail(request.payerEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found for email: " + request.payerEmail()));

        // Look up payee
        var payee = userRepository.findByUserEmail(request.payeeEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found for email: " + request.payeeEmail()));

        Long payerId = payer.getUserId();
        Long payeeId = payee.getUserId();

        return expenseService.createSettlement(
                groupId,
                payerId,
                payeeId,
                request.amount(),
                request.currency());
    }

    // TODO: Get group settlement history
}

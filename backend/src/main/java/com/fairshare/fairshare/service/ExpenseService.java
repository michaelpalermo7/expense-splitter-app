package com.fairshare.fairshare.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.AccessDeniedException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fairshare.fairshare.dto.BalanceDTO;
import com.fairshare.fairshare.dto.ExpenseDTO;
import com.fairshare.fairshare.dto.SettlementDTO;
import com.fairshare.fairshare.dto.ShareDTO;
import com.fairshare.fairshare.entity.Expense;
import com.fairshare.fairshare.entity.ExpenseShare;
import com.fairshare.fairshare.entity.Membership;
import com.fairshare.fairshare.entity.Settlement;
import com.fairshare.fairshare.entity.SplitMode;
import com.fairshare.fairshare.repository.ExpenseRepository;
import com.fairshare.fairshare.repository.ExpenseShareRepository;
import com.fairshare.fairshare.repository.GroupRepository;
import com.fairshare.fairshare.repository.MembershipRepository;
import com.fairshare.fairshare.repository.SettlementRepository;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final GroupRepository groupRepository;
    private final MembershipRepository membershipRepository;
    private final ExpenseShareRepository expenseShareRepository;
    private final SettlementRepository settlementRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            GroupRepository groupRepository,
            MembershipRepository membershipRepository,
            ExpenseShareRepository expenseShareRepository,
            SettlementRepository settlementRepository) {
        this.expenseRepository = expenseRepository;
        this.groupRepository = groupRepository;
        this.membershipRepository = membershipRepository;
        this.expenseShareRepository = expenseShareRepository;
        this.settlementRepository = settlementRepository;
    }

    /**
     * Backward-compatible overload that defaults to EQUAL split with no custom values.
     */
    @Transactional
    public ExpenseDTO createExpense(
            Long groupId,
            Long payerMembershipId,
            BigDecimal amount,
            Expense.CurrencyCode currency,
            String desc,
            Instant occurredAt) throws NotFoundException, AccessDeniedException {
        return createExpense(groupId, payerMembershipId, amount, currency, desc, occurredAt,
                null, null, (Long[]) null);
    }

    /**
     * Creates a new expense within a group and splits the amount among the
     * specified participants according to the given split mode.
     *
     * @param groupId                  the ID of the group in which the expense is
     *                                 created
     * @param payerMembershipId        the membership ID of the user who paid for
     *                                 the expense. must belong to the specified
     *                                 group
     * @param amount                   expense amount
     * @param currency                 currency, defaults to CAD
     * @param desc                     description of expense (optional)
     * @param occurredAt               when expenses occured, defaults to now
     * @param splitMode                split mode (EQUAL, EXACT, PERCENTAGE, SHARES)
     * @param splitValues              map of membershipId to value for non-EQUAL modes
     * @param participantMembershipIds membership IDs participating in the expense;
     * @return the created expense represented as an {@link ExpenseDTO}
     * @throws NotFoundException        if group, payer, or any participant does not
     *                                  exist
     * @throws AccessDeniedException    if the payer or any participant does not
     *                                  belong to the group
     * @throws IllegalArgumentException if the amount is null, non-positive, or if
     *                                  an empty participant list is provided
     * @throws IllegalStateException    if no participants are available to split
     *                                  the expense
     */
    @Transactional
    public ExpenseDTO createExpense(
            Long groupId,
            Long payerMembershipId,
            BigDecimal amount,
            Expense.CurrencyCode currency,
            String desc,
            Instant occurredAt,
            SplitMode splitMode,
            Map<Long, BigDecimal> splitValues,
            Long... participantMembershipIds) throws NotFoundException, AccessDeniedException {

        if (!groupRepository.existsById(groupId)) {
            throw new NotFoundException();
        }

        Membership payer = membershipRepository.findById(payerMembershipId)
                .orElseThrow(NotFoundException::new);
        if (!payer.getGroup().getGroupId().equals(groupId)) {
            throw new AccessDeniedException("Payer membership is not in this group");
        }

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Expense amount must be greater than 0");
        }
        BigDecimal normalizedAmount = amount.setScale(2, RoundingMode.HALF_UP);

        SplitMode mode = splitMode != null ? splitMode : SplitMode.EQUAL;

        final List<Membership> participants;
        if (participantMembershipIds != null && participantMembershipIds.length > 0) {
            List<Long> distinctIds = java.util.Arrays.stream(participantMembershipIds)
                    .filter(java.util.Objects::nonNull)
                    .distinct()
                    .toList();

            if (distinctIds.isEmpty()) {
                throw new IllegalArgumentException("Participant list cannot be empty");
            }

            List<Membership> loaded = membershipRepository.findAllById(distinctIds);
            if (loaded.size() != distinctIds.size()) {
                throw new NotFoundException();
            }
            boolean anyWrongGroup = loaded.stream()
                    .anyMatch(m -> !m.getGroup().getGroupId().equals(groupId));
            if (anyWrongGroup) {
                throw new AccessDeniedException("All participants must belong to the group");
            }
            participants = loaded;
        } else {
            participants = membershipRepository.findByGroup_GroupId(groupId);
            if (participants.isEmpty()) {
                throw new IllegalStateException("Cannot split expense: no members in group");
            }
        }

        Expense e = new Expense();
        e.setGroup(groupRepository.getReferenceById(groupId));
        e.setPayer(payer);
        e.setAmount(normalizedAmount);
        e.setCurrency(currency != null ? currency : Expense.CurrencyCode.CAD);
        e.setDescription(desc);
        e.setOccurredAt(occurredAt != null ? occurredAt : Instant.now());
        e.setSplitMode(mode);

        Expense saved = expenseRepository.save(e);

        int n = participants.size();
        List<ShareDTO> shares = new ArrayList<>(n);

        switch (mode) {
            case EQUAL -> {
                BigDecimal per = normalizedAmount
                        .divide(BigDecimal.valueOf(n), 2, RoundingMode.HALF_UP);
                BigDecimal runningTotal = BigDecimal.ZERO;

                for (int i = 0; i < n; i++) {
                    Membership m = participants.get(i);
                    BigDecimal shareAmount = (i < n - 1)
                            ? per
                            : normalizedAmount.subtract(runningTotal);

                    ExpenseShare es = new ExpenseShare();
                    es.setExpense(saved);
                    es.setMembership(m);
                    es.setShareAmount(shareAmount);
                    es.setShareRatio(null);
                    expenseShareRepository.save(es);

                    runningTotal = runningTotal.add(shareAmount);
                    shares.add(new ShareDTO(m.getMembershipId(), shareAmount, null));
                }
            }
            case EXACT -> {
                if (splitValues == null || splitValues.isEmpty()) {
                    throw new IllegalArgumentException("splitValues required for EXACT mode");
                }
                BigDecimal sum = splitValues.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
                if (sum.setScale(2, RoundingMode.HALF_UP).compareTo(normalizedAmount) != 0) {
                    throw new IllegalArgumentException("EXACT split values must sum to the expense amount");
                }
                for (Membership m : participants) {
                    BigDecimal val = splitValues.getOrDefault(m.getMembershipId(), BigDecimal.ZERO)
                            .setScale(2, RoundingMode.HALF_UP);
                    ExpenseShare es = new ExpenseShare();
                    es.setExpense(saved);
                    es.setMembership(m);
                    es.setShareAmount(val);
                    es.setShareRatio(null);
                    expenseShareRepository.save(es);
                    shares.add(new ShareDTO(m.getMembershipId(), val, null));
                }
            }
            case PERCENTAGE -> {
                if (splitValues == null || splitValues.isEmpty()) {
                    throw new IllegalArgumentException("splitValues required for PERCENTAGE mode");
                }
                BigDecimal sum = splitValues.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
                if (sum.setScale(2, RoundingMode.HALF_UP).compareTo(new BigDecimal("100.00")) != 0) {
                    throw new IllegalArgumentException("PERCENTAGE split values must sum to 100");
                }
                for (Membership m : participants) {
                    BigDecimal pct = splitValues.getOrDefault(m.getMembershipId(), BigDecimal.ZERO);
                    BigDecimal shareAmount = normalizedAmount.multiply(pct)
                            .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
                    BigDecimal ratio = pct.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
                    ExpenseShare es = new ExpenseShare();
                    es.setExpense(saved);
                    es.setMembership(m);
                    es.setShareAmount(shareAmount);
                    es.setShareRatio(ratio);
                    expenseShareRepository.save(es);
                    shares.add(new ShareDTO(m.getMembershipId(), shareAmount, ratio));
                }
            }
            case SHARES -> {
                if (splitValues == null || splitValues.isEmpty()) {
                    throw new IllegalArgumentException("splitValues required for SHARES mode");
                }
                BigDecimal totalUnits = splitValues.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
                if (totalUnits.compareTo(BigDecimal.ZERO) <= 0) {
                    throw new IllegalArgumentException("Total shares must be greater than 0");
                }
                for (Membership m : participants) {
                    BigDecimal units = splitValues.getOrDefault(m.getMembershipId(), BigDecimal.ZERO);
                    BigDecimal shareAmount = normalizedAmount.multiply(units)
                            .divide(totalUnits, 2, RoundingMode.HALF_UP);
                    BigDecimal ratio = units.divide(totalUnits, 4, RoundingMode.HALF_UP);
                    ExpenseShare es = new ExpenseShare();
                    es.setExpense(saved);
                    es.setMembership(m);
                    es.setShareAmount(shareAmount);
                    es.setShareRatio(ratio);
                    expenseShareRepository.save(es);
                    shares.add(new ShareDTO(m.getMembershipId(), shareAmount, ratio));
                }
            }
        }

        return new ExpenseDTO(
                saved.getExpenseId(),
                groupId,
                payerMembershipId,
                saved.getAmount(),
                saved.getCurrency(),
                saved.getDescription(),
                saved.getOccurredAt(),
                saved.getCreatedAt(),
                saved.getSplitMode(),
                shares);
    }

    /**
     * Gets a list of all expenses for a given group.
     * 
     * @param groupId the ID of the group whose expenses are being retrieved
     * @return a list of {@link ExpenseDTO} objects representing the group's
     *         expenses.
     * @throws NotFoundException if the group does not exist
     */
    @Transactional(readOnly = true)
    public List<ExpenseDTO> listGroupExpenses(Long groupId) throws NotFoundException {
        if (!groupRepository.existsById(groupId))
            throw new NotFoundException();

        var expenses = expenseRepository.findByGroup_GroupId(groupId);
        if (expenses.isEmpty())
            return List.of();

        var expenseIds = expenses.stream().map(Expense::getExpenseId).toList();

        var allShares = expenseShareRepository.findByExpense_ExpenseIdIn(expenseIds);

        var sharesByExpenseId = allShares.stream()
                .collect(java.util.stream.Collectors.groupingBy(es -> es.getExpense().getExpenseId()));

        return expenses.stream().map(expense -> {
            var shares = sharesByExpenseId.getOrDefault(expense.getExpenseId(), List.of())
                    .stream()
                    .map(s -> new ShareDTO(
                            s.getMembership().getMembershipId(),
                            s.getShareAmount(),
                            s.getShareRatio()))
                    .toList();

            return new ExpenseDTO(
                    expense.getExpenseId(),
                    expense.getGroup().getGroupId(),
                    expense.getPayer().getMembershipId(),
                    expense.getAmount(),
                    expense.getCurrency(),
                    expense.getDescription(),
                    expense.getOccurredAt(),
                    expense.getCreatedAt(),
                    expense.getSplitMode(),
                    shares);
        }).toList();
    }

    /**
     * Calculates the current balance for each member in a group, positive for owed
     * money, negative for oweing money.
     * 
     * @param groupId the ID of the group of which balances are calculated
     * @return a list of {@link BalanceDTO} objects representing each member's
     *         balance
     * @throws NotFoundException if the group does not exist
     */
    @Transactional(readOnly = true)
    public List<BalanceDTO> getUserBalances(Long groupId) throws NotFoundException {
        if (!groupRepository.existsById(groupId)) {
            throw new NotFoundException();
        }

        List<Membership> members = membershipRepository.findByGroup_GroupId(groupId);

        Map<Long, BigDecimal> balances = new HashMap<>();

        for (Membership member : members) {
            balances.put(member.getMembershipId(), BigDecimal.ZERO);
        }

        List<Expense> expenses = expenseRepository.findByGroup_GroupId(groupId);
        for (Expense exp : expenses) {
            Long payerId = exp.getPayer().getMembershipId();
            BigDecimal current = balances.getOrDefault(payerId, BigDecimal.ZERO);
            balances.put(payerId, current.add(exp.getAmount()));
        }

        List<ExpenseShare> shares = expenseShareRepository.findByExpense_Group_GroupId(groupId);
        for (ExpenseShare share : shares) {
            Long participantId = share.getMembership().getMembershipId();
            BigDecimal current = balances.getOrDefault(participantId, BigDecimal.ZERO);
            balances.put(participantId, current.subtract(share.getShareAmount()));
        }

        List<Settlement> settlements = settlementRepository.findByGroup_GroupId(groupId);
        for (Settlement s : settlements) {
            Long payerId = s.getPayer().getMembershipId();
            Long payeeId = s.getPayee().getMembershipId();
            BigDecimal amt = s.getAmount();
            balances.put(payerId, balances.get(payerId).add(amt));
            balances.put(payeeId, balances.get(payeeId).subtract(amt));
        }

        BigDecimal total = balances.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (total.compareTo(BigDecimal.ZERO) != 0 && !balances.isEmpty()) {
            Long firstId = balances.keySet().iterator().next();
            balances.put(firstId, balances.get(firstId).subtract(total));
        }

        return balances.entrySet().stream()
                .map(e -> new BalanceDTO(e.getKey(), e.getValue().setScale(2, RoundingMode.HALF_UP)))
                .toList();
    }

    /**
     * Creates a settlement between two members in a group.
     * A settlement represents a payment from the payer to the payee and is used to
     * reduce outstanding balances within the group.
     * 
     * @param groupId           the ID of the group in which the settlement is
     *                          created
     * @param payerMembershipId the membership ID of the member making the payment
     * @param payeeMembershipId the membership ID of the member receiving the
     *                          payment
     * @param amount            settlement amount; must be greater than zero
     * @param currency          currency of the settlement
     * @return the created settlement represented as a {@link SettlementDTO}
     * @throws NotFoundException        if the group, payer, or payee does not exist
     * @throws AccessDeniedException    if either membership does not belong to the
     *                                  group
     * @throws IllegalArgumentException if the amount is null or non-positive
     */
    @Transactional
    public SettlementDTO createSettlement(
            Long groupId,
            Long payerMembershipId,
            Long payeeMembershipId,
            BigDecimal amount,
            Settlement.CurrencyCode currency) throws NotFoundException, AccessDeniedException {

        if (!groupRepository.existsById(groupId))
            throw new NotFoundException();

        Membership payer = membershipRepository.findById(payerMembershipId)
                .orElseThrow(NotFoundException::new);
        Membership payee = membershipRepository.findById(payeeMembershipId)
                .orElseThrow(NotFoundException::new);

        if (!payer.getGroup().getGroupId().equals(groupId) || !payee.getGroup().getGroupId().equals(groupId)) {
            throw new AccessDeniedException("Both memberships must belong to the group");
        }

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Cannot settle 0 or negative");
        }

        Settlement s = new Settlement();
        s.setPayer(payer);
        s.setPayee(payee);
        s.setGroup(groupRepository.getReferenceById(groupId));
        s.setAmount(amount.setScale(2, RoundingMode.HALF_UP));
        s.setCurrency(currency != null ? currency : Settlement.CurrencyCode.CAD);
        s.setSettledAt(Instant.now());

        Settlement saved = settlementRepository.save(s);

        return new SettlementDTO(
                saved.getSettlementId(),
                payer.getMembershipId(),
                payee.getMembershipId(),
                groupId,
                saved.getAmount(),
                saved.getCurrency(),
                saved.getSettledAt());
    }

    /**
     * Gets all settlements for a given group, ordered by most recent first.
     * 
     * @param groupId the ID of the group whose settlements are being retrieved
     * @return a list of {@link SettlementDTO} objects representing the group's
     *         settlements
     * @throws NotFoundException if the group does not exist
     */
    @Transactional(readOnly = true)
    public List<SettlementDTO> listGroupSettlements(Long groupId) throws NotFoundException {
        if (!groupRepository.existsById(groupId)) {
            throw new NotFoundException();
        }

        return settlementRepository
                .findByGroup_GroupIdOrderBySettledAtDesc(groupId)
                .stream()
                .map(s -> new SettlementDTO(
                        s.getSettlementId(),
                        s.getPayer().getMembershipId(),
                        s.getPayee().getMembershipId(),
                        s.getGroup().getGroupId(),
                        s.getAmount(),
                        s.getCurrency(),
                        s.getSettledAt()))
                .toList();
    }
}

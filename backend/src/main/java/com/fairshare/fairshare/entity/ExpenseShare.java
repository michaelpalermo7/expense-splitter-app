package com.fairshare.fairshare.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "expense_share", uniqueConstraints = @UniqueConstraint(name = "ux_expense_share_unique", columnNames = {
        "expense_id", "membership_id" }))
public class ExpenseShare {

    /* ==== attributes ==== */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "expense_share_id")
    private Long expenseShareId;

    @NotNull
    @DecimalMin(value = "0.00", inclusive = true, message = "Share amount must be >= 0")
    @Digits(integer = 10, fraction = 2)
    @Column(name = "share_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal shareAmount;

    @Digits(integer = 2, fraction = 4)
    @Column(name = "share_ratio", precision = 6, scale = 4)
    private BigDecimal shareRatio;

    /* ==== relationships ==== */

    // many-to-one: expense_share -> membership (participant)
    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "membership_id", nullable = false)
    private Membership membership;

    // many-to-one: expense_share -> expense
    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;

    /* ==== getters and setters ==== */
    public Long getExpenseShareId() {
        return expenseShareId;
    }

    public void setExpenseShareId(Long expenseShareId) {
        this.expenseShareId = expenseShareId;
    }

    public BigDecimal getShareAmount() {
        return shareAmount;
    }

    public void setShareAmount(BigDecimal shareAmount) {
        this.shareAmount = shareAmount;
    }

    public BigDecimal getShareRatio() {
        return shareRatio;
    }

    public void setShareRatio(BigDecimal shareRatio) {
        this.shareRatio = shareRatio;
    }

    public Expense getExpense() {
        return expense;
    }

    public void setExpense(Expense expense) {
        this.expense = expense;
    }

    public Membership getMembership() {
        return membership;
    }

    public void setMembership(Membership membership) {
        this.membership = membership;
    }
}

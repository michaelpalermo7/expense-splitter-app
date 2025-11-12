import type { ExpenseAddFormValues } from "../components/ExpenseAddForm";
import type { SettlementAddFormValues } from "../components/SettlementAddForm";
import type { Balance, Expense, Settlement } from "../types";
import { api } from "./client";

export const getGroupExpensesByToken = (token: string) =>
  api.get<Expense[]>(`/group/${encodeURIComponent(token)}/expenses`);

export const getGroupBalancesByToken = (token: string) =>
  api.get<Balance[]>(`/group/${encodeURIComponent(token)}/balances`);

export const getGroupSettlementsByToken = (token: string) =>
  api.get<Settlement[]>(`/group/${encodeURIComponent(token)}/settlements`);

export function addExpenseByToken(token: string, data: ExpenseAddFormValues) {
  return api.post(`/group/${token}/expenses`, data);
}

export function addSettlementByToken(
  token: string,
  data: SettlementAddFormValues
) {
  return api.post(`/group/${token}/settlements`, data);
}

import type {
  Balance,
  Expense,
  ExpenseCreate,
  SettlementCreate,
} from "../types";
import { api } from "./client";

export const getGroupExpenses = (groupId: number) => {
  return api.get<Expense[]>(`/groups/${groupId}/expenses`);
};

export const getGroupBalances = (groupId: number) => {
  return api.get<Balance[]>(`/groups/${groupId}/balances`);
};

export function addGroupExpense(groupId: number, data: ExpenseCreate) {
  const payload = { ...data };

  //format occuredat to match instant now expected in backend
  payload.occurredAt = new Date(data.occurredAt).toISOString();

  return api.post(`/groups/${groupId}/expenses`, payload);
}

export function addGroupSettlement(groupId: number, data: SettlementCreate) {
  return api.post(`/groups/${groupId}/settlements`, data);
}

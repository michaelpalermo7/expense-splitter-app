import { useEffect, useState } from "react";
import { getGroupExpensesByToken } from "../services/ExpenseService";
import type { Expense } from "../types";

export function useGroupExpensesByToken(token?: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  useEffect(() => {
    if (!token) return;
    getGroupExpensesByToken(token).then((res) => setExpenses(res.data));
  }, [token]);
  return { expenses };
}

import { useEffect, useState } from "react";
import { getGroupExpenses } from "../services/ExpenseService";
import type { Expense } from "../types";

export function useGroupExpenses(id?: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (!id) return;
    const groupId = Number(id);
    if (Number.isNaN(groupId)) return;

    getGroupExpenses(groupId).then((res) => setExpenses(res.data));
  }, [id]);

  return { expenses, setExpenses };
}

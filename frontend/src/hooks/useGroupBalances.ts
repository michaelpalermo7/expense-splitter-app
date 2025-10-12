import { useEffect, useState } from "react";
import { getGroupBalances } from "../services/ExpenseService";
import type { Balance } from "../types";

export const useGroupBalances = (groupId?: string | number) => {
  const [balances, setBalances] = useState<Balance[]>([]);

  useEffect(() => {
    if (!groupId) return;

    getGroupBalances(Number(groupId)).then((res) => {
      setBalances(res.data);
    });
  }, [groupId]);

  return { balances };
};

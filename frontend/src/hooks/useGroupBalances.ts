import { useEffect, useState } from "react";
import { getGroupBalancesByToken } from "../services/ExpenseService";
import type { Balance } from "../types";

export function useGroupBalancesByToken(token?: string) {
  const [balances, setBalances] = useState<Balance[]>([]);
  useEffect(() => {
    if (!token) return;
    getGroupBalancesByToken(token).then((res) => setBalances(res.data));
  }, [token]);
  return { balances };
}

import { useEffect, useState } from "react";
import { getGroupSettlementsByToken } from "../services/ExpenseService";
import type { Settlement } from "../types";

export function useGroupSettlementsByToken(token?: string) {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  useEffect(() => {
    if (!token) return;
    getGroupSettlementsByToken(token).then((res) => setSettlements(res.data));
  }, [token]);
  return { settlements };
}

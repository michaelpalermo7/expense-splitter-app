import { useEffect, useState } from "react";
import type { Settlement } from "../types";
import { getGroupSettlements } from "../services/ExpenseService";

export const useGroupSettlements = (groupId?: string) => {
  const [settlements, setSettlements] = useState<Settlement[]>([]);

  useEffect(() => {
    if (!groupId) return;
    const idNum = Number(groupId);
    if (Number.isNaN(idNum)) return;

    getGroupSettlements(idNum).then(setSettlements);
  }, [groupId]);

  return { settlements };
};

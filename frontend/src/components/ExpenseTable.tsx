import type { Expense } from "../types";
import { fmtDate } from "../utils/date";
import { Info } from "lucide-react";

type ExpensesListProps = {
  expenses: Expense[];
  nameById: Record<number, string>;
};

const ExpensesList = ({ expenses, nameById }: ExpensesListProps) => {
  if (expenses.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-md text-sm mx-auto">
        <Info className="w-4 h-4 text-black" />
        <span>No expenses yet — create your first one to get started.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {expenses.map((e) => (
        <div
          key={e.expenseId}
          className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition-shadow"
        >
          <div>
            <div className="text-gray-800 font-medium">
              {e.description || "Untitled expense"}
            </div>
            <div className="text-sm text-gray-500">{fmtDate(e.occurredAt)}</div>
            <div className="text-sm text-gray-500">
              Paid by:{" "}
              {nameById[e.payerMembershipId] ?? `Member ${e.payerMembershipId}`}
            </div>
          </div>
          <div className="mt-2 sm:mt-0 sm:ml-4">
            <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold tabular-nums text-blue-700">
              ${Number(e.amount).toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpensesList;

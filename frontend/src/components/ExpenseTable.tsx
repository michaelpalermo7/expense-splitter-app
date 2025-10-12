import type { Expense } from "../types";
import { fmtDate } from "../utils/date";

type ExpensesListProps = {
  expenses: Expense[];
  nameById: Record<number, string>;
};

const ExpensesList = ({ expenses, nameById }: ExpensesListProps) => {
  if (expenses.length === 0) {
    return <p className="text-gray-500">No expenses yet.</p>;
  }

  return (
    <div className="relative overflow-x-auto shadow-sm sm:rounded-lg bg-white hover:shadow-md">
      <table className="w-full text-lg text-left text-gray-700">
        {/* Header of table */}
        <thead className="text-md text-white uppercase bg-black">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-xs uppercase tracking-wide opacity-90 font-normal"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs uppercase tracking-wide opacity-90 font-normal"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs uppercase tracking-wide opacity-90 font-normal"
            >
              Occurred At
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs uppercase tracking-wide opacity-90 font-normal"
            >
              Paid By
            </th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} className="bg-white border-none">
              <td className="px-6 py-4">
                <span className="block truncate text-gray-700 font-medium">
                  {e.description || "Untitled expense"}
                </span>
              </td>

              <td className="px-6 py-4">
                <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold tabular-nums bg-blue-50 text-blue-700">
                  ${Number(e.amount).toFixed(2)}
                </span>
              </td>

              <td className="px-6 py-4">{fmtDate(e.occurredAt)}</td>

              <td className="px-6 py-4">
                {nameById[e.payerId] ?? `User ${e.payerId}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesList;

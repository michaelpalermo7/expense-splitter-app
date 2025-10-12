import type { Expense } from "../types";
import { fmtDate } from "../utils/date";

type ExpensesListProps = {
  expenses: Expense[];
  nameById: Record<number, string>;
};

const ExpensesList = ({ expenses, nameById }: ExpensesListProps) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
      <table className="w-full text-lg text-left rtl:text-right text-gray-700">
        <thead className="text-md text-gray-800 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Amount
            </th>
            <th scope="col" className="px-6 py-3">
              Occurred At
            </th>
            <th scope="col" className="px-6 py-3">
              Paid By
            </th>
          </tr>
        </thead>

        <tbody>
          {expenses.length === 0 ? (
            <tr className="bg-white">
              <td className="px-6 py-6 text-gray-500" colSpan={4}>
                No expenses yet.
              </td>
            </tr>
          ) : (
            expenses.map((e, index) => (
              <tr
                key={e.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                } border-none`}
              >
                <td className="px-6 py-4">
                  <span className="block truncate">
                    {e.description || "Untitled expense"}
                  </span>
                </td>

                <td className="px-6 py-4">${e.amount}</td>

                <td className="px-6 py-4">{fmtDate(e.occurredAt)}</td>

                <td className="px-6 py-4">
                  {nameById[e.payerId] ?? `User ${e.payerId}`}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesList;

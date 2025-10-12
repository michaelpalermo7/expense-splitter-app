import type { Balance } from "../types";

type BalancesListProps = {
  balances: Balance[];
  nameById: Record<number, string>;
};

const BalancesList = ({ balances, nameById }: BalancesListProps) => {
  if (balances.length === 0) {
    return <p className="text-gray-500">No balances yet.</p>;
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
              Member
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs uppercase tracking-wide opacity-90 text-right font-normal "
            >
              Balance
            </th>
          </tr>
        </thead>

        <tbody>
          {balances.map((b) => {
            const isNegative = b.balance < 0;
            const pillClass = isNegative
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700";

            return (
              <tr key={b.userId} className="bg-white border-none">
                <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">
                  {nameById[b.userId] ?? `User ${b.userId}`}
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-semibold tabular-nums ${pillClass}`}
                  >
                    ${b.balance.toFixed(2)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BalancesList;

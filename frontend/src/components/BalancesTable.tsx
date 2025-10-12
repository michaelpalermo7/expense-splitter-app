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
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
      <table className="w-full text-lg text-left text-gray-700">
        <thead className="text-md text-gray-800 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3">
              Member
            </th>
            <th scope="col" className="px-6 py-3">
              Balance
            </th>
          </tr>
        </thead>

        <tbody>
          {balances.map((b, index) => (
            <tr
              key={b.userId}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} border-none`}
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {nameById[b.userId] ?? `User ${b.userId}`}
              </td>
              <td
                className={`px-6 py-4 font-semibold ${
                  b.balance < 0 ? "text-red-600" : "text-green-700"
                }`}
              >
                ${b.balance.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BalancesList;

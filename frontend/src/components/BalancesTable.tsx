import type { Balance } from "../types";

type BalancesListProps = {
  balances: Balance[];
  nameById: Record<number, string>;
};

const BalancesList = ({ balances, nameById }: BalancesListProps) => {
  if (balances.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4 bg-gray-50 border border-gray-200 rounded-md">
        No balances yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {balances.map((b) => {
        const isNegative = b.balance < 0;
        const pillClass = isNegative
          ? "text-red-700"
          : "text-green-700";

        return (
          <div
            key={b.membershipId}
            className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition-shadow"
          >
            <div className="text-gray-800 font-medium">
              {nameById[b.membershipId] ?? `Member ${b.membershipId}`}
            </div>
            <div>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-semibold tabular-nums ${pillClass}`}
              >
                ${Number(b.balance).toFixed(2)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BalancesList;

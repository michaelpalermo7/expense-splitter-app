import type { FC } from "react";
import type { Settlement } from "../types";
import { fmtDate } from "../utils/date";
import { ChevronRight } from "lucide-react";

type SettlementsListProps = {
  settlements: Settlement[];
  nameById: Record<number, string>;
};

const SettlementsList: FC<SettlementsListProps> = ({
  settlements,
  nameById,
}) => {
  if (settlements.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4 bg-gray-50 border border-gray-200 rounded-md">
        No settlements yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {settlements.map((s, index) => {
        const payerName =
          nameById[s.payerMembershipId] ?? `Member ${s.payerMembershipId}`;
        const payeeName =
          nameById[s.payeeMembershipId] ?? `Member ${s.payeeMembershipId}`;

        return (
          <div
            key={
              s.id ??
              `${s.payerMembershipId}-${s.payeeMembershipId}-${s.settledAt}-${index}`
            }
            className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition-shadow"
          >
            <div>
              <div className="font-medium text-gray-800">
                {payerName}{" "}
                <ChevronRight className="inline w-4 h-4 text-gray-400 mx-1" />{" "}
                {payeeName}
              </div>
              <div className="text-sm text-gray-500">
                {fmtDate(s.settledAt)}
              </div>
              <div className="text-sm text-gray-500">Settlement</div>
            </div>

            <div>
              <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold tabular-nums text-blue-700">
                ${Number(s.amount).toFixed(2)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SettlementsList;

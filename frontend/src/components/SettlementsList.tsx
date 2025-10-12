import type { FC } from "react";
import type { Settlement } from "../types";
import { fmtDate } from "../utils/date";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type SettlementsListProps = {
  settlements: Settlement[];
  nameById: Record<number, string>;
};

const SettlementsList: FC<SettlementsListProps> = ({
  settlements,
  nameById,
}) => {
  if (settlements.length === 0) {
    return <p className="text-gray-500">No settlements yet.</p>;
  }

  return (
    <div className="mb-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {settlements.map((s) => {
        const payerName = nameById[s.payerId] ?? `User ${s.payerId}`;
        const payeeName = nameById[s.payeeId] ?? `User ${s.payeeId}`;

        return (
          <div
            key={s.id}
            className="group rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="bg-black p-3 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide opacity-90">
                  Settlement
                </span>
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">
                  {fmtDate(s.settledAt)}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">{payerName}</span>
                <ArrowForwardIosIcon
                  fontSize="inherit"
                  className="text-gray-400 scale-90"
                />
                <span className="font-medium">{payeeName}</span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold tabular-nums bg-blue-50 text-blue-700">
                  ${s.amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SettlementsList;

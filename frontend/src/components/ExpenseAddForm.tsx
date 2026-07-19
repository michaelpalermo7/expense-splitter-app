import { useEffect, useState, type FormEvent } from "react";
import LabeledInput from "./LabeledInput";
import PrimaryButton from "../components/FormButton";
import BackButton from "./BackButton";
import { useNavigate } from "react-router-dom";
import type { SplitMode } from "../types";

export type ExpenseAddFormValues = {
  payerMembershipId: number;
  amount: number;
  currency: string;
  description: string;
  occurredAt: string;
  participantMembershipIds?: number[];
  splitMode?: SplitMode;
  splitValues?: Record<number, number>;
};

export type MemberOption = { membershipId: number; displayName: string };

interface ExpenseAddFormProps {
  members: MemberOption[];
  onSubmit: (
    values: ExpenseAddFormValues,
    e: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
}

const SPLIT_MODES: { value: SplitMode; label: string }[] = [
  { value: "EQUAL", label: "Equal" },
  { value: "EXACT", label: "Exact" },
  { value: "PERCENTAGE", label: "%" },
  { value: "SHARES", label: "Shares" },
];

const ExpenseAddForm = ({ members, onSubmit }: ExpenseAddFormProps) => {
  const navigate = useNavigate();
  const [payerId, setPayerId] = useState<number | undefined>();
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("CAD");
  const [description, setDescription] = useState<string>("");
  const [occurredAt, setOccurredAt] = useState<string>("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [useSubset, setUseSubset] = useState<boolean>(false);
  const [splitMode, setSplitMode] = useState<SplitMode>("EQUAL");
  const [splitValues, setSplitValues] = useState<Record<number, string>>({});

  useEffect(() => {
    if (members.length) {
      setPayerId((prev) => prev ?? members[0].membershipId);
      setSelected(new Set(members.map((m) => m.membershipId)));
    }
  }, [members]);

  const toggle = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const selectAll = () =>
    setSelected(new Set(members.map((m) => m.membershipId)));
  const clearAll = () => setSelected(new Set());

  const activeParticipants = useSubset
    ? members.filter((m) => selected.has(m.membershipId))
    : members;

  const splitTotal = activeParticipants.reduce(
    (sum, m) => sum + (parseFloat(splitValues[m.membershipId] || "0") || 0),
    0
  );

  const parsedAmount = parseFloat(amount) || 0;

  const splitValid = (() => {
    if (splitMode === "EQUAL") return true;
    if (activeParticipants.length === 0) return false;
    const hasAllValues = activeParticipants.every(
      (m) => parseFloat(splitValues[m.membershipId] || "0") >= 0
    );
    if (!hasAllValues) return false;
    if (splitMode === "EXACT")
      return Math.abs(splitTotal - parsedAmount) < 0.01;
    if (splitMode === "PERCENTAGE") return Math.abs(splitTotal - 100) < 0.01;
    if (splitMode === "SHARES") return splitTotal > 0;
    return true;
  })();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!payerId || !splitValid) return;

    const numericSplitValues: Record<number, number> = {};
    if (splitMode !== "EQUAL") {
      activeParticipants.forEach((m) => {
        numericSplitValues[m.membershipId] =
          parseFloat(splitValues[m.membershipId] || "0") || 0;
      });
    }

    const payload: ExpenseAddFormValues = {
      payerMembershipId: payerId,
      amount: parseFloat(amount),
      currency,
      description,
      occurredAt,
      participantMembershipIds: useSubset ? Array.from(selected) : undefined,
      splitMode,
      splitValues: splitMode !== "EQUAL" ? numericSplitValues : undefined,
    };

    onSubmit(payload, e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="payer" className="text-sm font-medium text-gray-700">
          Paid By
        </label>
        <select
          id="payer"
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none
               focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
          value={payerId ?? ""}
          onChange={(e) => setPayerId(Number(e.target.value))}
          required
        >
          <option value="" disabled>
            Select a member
          </option>
          {members.map((m) => (
            <option key={m.membershipId} value={m.membershipId}>
              {m.displayName}
            </option>
          ))}
        </select>
      </div>

      <LabeledInput
        id="amount"
        label="Amount"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        min="0.01"
        step="0.01"
        inputMode="decimal"
        required
      />

      <LabeledInput
        id="currency"
        label="Currency"
        placeholder='e.g. "CAD"'
        value={currency}
        onChange={(e) => setCurrency(e.target.value.toUpperCase())}
        type="text"
        autoComplete="off"
        required
      />

      <LabeledInput
        id="description"
        label="Description"
        placeholder="What was this expense for?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
        autoComplete="off"
        required
      />

      <LabeledInput
        id="occurredAt"
        label="Date"
        placeholder="Select date/time"
        value={occurredAt}
        onChange={(e) => setOccurredAt(e.target.value)}
        type="datetime-local"
        required
      />

      <div className="pt-2 text-left">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={useSubset}
            onChange={(e) => setUseSubset(e.target.checked)}
            className="accent-black w-4 h-4 cursor-pointer"
          />
          <span className="text-sm text-gray-700">
            Split with a subset of members
          </span>
        </label>
      </div>

      {useSubset && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Participants</span>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-sm text-gray-700 underline cursor-pointer"
                onClick={selectAll}
              >
                Select all
              </button>
              <button
                type="button"
                className="text-sm text-gray-700 underline cursor-pointer"
                onClick={clearAll}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {members.map((m) => {
              const active = selected.has(m.membershipId);
              return (
                <button
                  key={m.membershipId}
                  type="button"
                  onClick={() => toggle(m.membershipId)}
                  className={`rounded-lg px-3 py-1.5 text-sm cursor-pointer border transition-all duration-200 ${
                    active
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                >
                  {m.displayName}
                </button>
              );
            })}
          </div>

          {useSubset && selected.size === 0 && (
            <p className="text-xs text-red-600">
              Select at least one participant.
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-700">Split Mode</span>
        <div className="flex gap-1">
          {SPLIT_MODES.map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => setSplitMode(mode.value)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                splitMode === mode.value
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {splitMode !== "EQUAL" && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">
            {splitMode === "EXACT" && "Amount per person"}
            {splitMode === "PERCENTAGE" && "Percentage per person"}
            {splitMode === "SHARES" && "Shares per person"}
          </span>
          <div className="flex flex-col gap-3">
            {activeParticipants.map((m) => (
              <div
                key={m.membershipId}
                className="flex items-center gap-3"
              >
                <span className="text-sm font-medium text-gray-700 w-28 truncate">
                  {m.displayName}
                </span>
                <input
                  type="number"
                  min="0"
                  step={splitMode === "SHARES" ? "1" : "0.01"}
                  value={splitValues[m.membershipId] || ""}
                  onChange={(e) =>
                    setSplitValues((prev) => ({
                      ...prev,
                      [m.membershipId]: e.target.value,
                    }))
                  }
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 outline-none
                            focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
          <p
            className={`text-xs ${splitValid ? "text-gray-500" : "text-red-600"}`}
          >
            {splitMode === "EXACT" &&
              `Total: $${splitTotal.toFixed(2)} / $${parsedAmount.toFixed(2)}`}
            {splitMode === "PERCENTAGE" &&
              `Total: ${splitTotal.toFixed(1)}% / 100%`}
            {splitMode === "SHARES" && `Total shares: ${splitTotal}`}
          </p>
        </div>
      )}

      <div className="flex flex-col items-center gap-3 mt-6">
        <PrimaryButton label="Add Expense" />
        <BackButton label="Back" onClick={() => navigate(-1)} />
      </div>
    </form>
  );
};

export default ExpenseAddForm;

import { useEffect, useState, type FormEvent } from "react";
import LabeledInput from "./LabeledInput";
import PrimaryButton from "../components/FormButton";
import BackButton from "./BackButton";
import { useNavigate } from "react-router-dom";

export type ExpenseAddFormValues = {
  payerMembershipId: number;
  amount: number;
  currency: string;
  description: string;
  occurredAt: string;
  participantMembershipIds?: number[];
};

export type MemberOption = { membershipId: number; displayName: string };

interface ExpenseAddFormProps {
  members: MemberOption[];
  onSubmit: (
    values: ExpenseAddFormValues,
    e: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
}

const ExpenseAddForm = ({ members, onSubmit }: ExpenseAddFormProps) => {
  const navigate = useNavigate();
  const [payerId, setPayerId] = useState<number | undefined>();
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("CAD");
  const [description, setDescription] = useState<string>("");
  const [occurredAt, setOccurredAt] = useState<string>("");
  const [selected, setSelected] = useState<Set<number>>(new Set()); // participants subset
  const [useSubset, setUseSubset] = useState<boolean>(false);

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!payerId) return;

    const payload: ExpenseAddFormValues = {
      payerMembershipId: payerId,
      amount: parseFloat(amount),
      currency,
      description,
      occurredAt,
      participantMembershipIds: useSubset ? Array.from(selected) : undefined,
    };

    onSubmit(payload, e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white  ">
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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Participants</span>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-sm underline cursor-pointer"
                onClick={selectAll}
              >
                Select all
              </button>
              <button
                type="button"
                className="text-sm underline cursor-pointer"
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
                  className={`rounded-full px-3 py-1.5 text-sm border ${
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

      <div className="flex flex-col items-center gap-3 mt-6">
        <PrimaryButton label="Add Expense" />
        <BackButton label="Back" onClick={() => navigate(-1)} />
      </div>
    </form>
  );
};

export default ExpenseAddForm;

import { useEffect, useState, type FormEvent } from "react";
import LabeledInput from "./LabeledInput";
import BackButton from "./BackButton";
import FormButton from "./FormButton";
import { useNavigate } from "react-router-dom";

export type SettlementAddFormValues = {
  payerMembershipId: number;
  payeeMembershipId: number;
  amount: number;
  currency: string;
};

export type MemberOption = { membershipId: number; displayName: string };

interface SettlementAddFormProps {
  members: MemberOption[];
  onSubmit: (
    values: SettlementAddFormValues,
    e: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
}

const inputBase =
  "w-full rounded-md border border-gray-300 px-3 py-2 outline-none " +
  "focus:border-gray-500 focus:ring-2 focus:ring-gray-300";

const fieldLabel = "text-sm font-medium text-gray-700";

const SettlementAddForm = ({ members, onSubmit }: SettlementAddFormProps) => {
  const navigate = useNavigate();
  const [payerId, setPayerId] = useState<number | "">("");
  const [payeeId, setPayeeId] = useState<number | "">("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("CAD");

  useEffect(() => {
    if (members.length >= 2) {
      setPayerId(members[0].membershipId);
      setPayeeId(members[1].membershipId);
    } else if (members.length === 1) {
      setPayerId(members[0].membershipId);
    }
  }, [members]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (payerId === "" || payeeId === "" || payerId === payeeId) return;
    onSubmit(
      {
        payerMembershipId: Number(payerId),
        payeeMembershipId: Number(payeeId),
        amount: parseFloat(amount),
        currency,
      },
      e
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-6">
      <div className="flex flex-col gap-2 text-left">
        <label className={fieldLabel}>Payer</label>
        <select
          className={inputBase}
          value={payerId}
          onChange={(e) => setPayerId(Number(e.target.value))}
          required
        >
          {members.map((m) => (
            <option key={m.membershipId} value={m.membershipId}>
              {m.displayName}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label className={fieldLabel}>Payee</label>
        <select
          className={inputBase}
          value={payeeId}
          onChange={(e) => setPayeeId(Number(e.target.value))}
          required
        >
          {members.map((m) => (
            <option key={m.membershipId} value={m.membershipId}>
              {m.displayName}
            </option>
          ))}
        </select>
        {payerId && payeeId && payerId === payeeId && (
          <p className="text-xs text-red-600">
            Payer and payee must be different.
          </p>
        )}
      </div>

      <LabeledInput
        id="amount"
        label="Amount"
        placeholder="Enter settlement amount"
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

      <div className="mt-2 flex flex-col gap-3 items-stretch">
        <FormButton label="Settle" />
        <div className="w-full">
          <BackButton label="Back" onClick={() => navigate(-1)} />
        </div>
      </div>
    </form>
  );
};

export default SettlementAddForm;

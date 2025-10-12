import { useState, type FormEvent, type ChangeEvent } from "react";
import LabeledInput from "./LabeledInput";
import PrimaryButton from "./FormButton";

export type SettlementAddFormValues = {
  payerEmail: string;
  payeeEmail: string;
  amount: number;
  currency: string;
};

interface SettlementAddFormProps {
  onSubmit: (
    values: SettlementAddFormValues,
    e: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
}

const SettlementAddForm = ({ onSubmit }: SettlementAddFormProps) => {
  const [payerEmail, setPayerEmail] = useState<string>("");
  const [payeeEmail, setPayeeEmail] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("CAD");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    onSubmit(
      {
        payerEmail,
        payeeEmail,
        amount: parsedAmount,
        currency,
      },
      e
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md"
    >
      <LabeledInput
        id="payer-email"
        label="Payer Email"
        placeholder="Enter payer's email"
        value={payerEmail}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPayerEmail(e.target.value)
        }
        type="email"
        autoComplete="email"
        required
      />

      <LabeledInput
        id="payee-email"
        label="Payee Email"
        placeholder="Enter payee's email"
        value={payeeEmail}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPayeeEmail(e.target.value)
        }
        type="email"
        autoComplete="email"
        required
      />

      <LabeledInput
        id="amount"
        label="Amount"
        placeholder="Enter settlement amount"
        value={amount}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setAmount(e.target.value)
        }
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
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setCurrency(e.target.value.toUpperCase())
        }
        type="text"
        autoComplete="off"
        required
      />

      <div className="flex justify-center mt-4">
        <PrimaryButton label="Add Settlement" />
      </div>
    </form>
  );
};

export default SettlementAddForm;

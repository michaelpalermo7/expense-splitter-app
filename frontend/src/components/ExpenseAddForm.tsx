import { useState, type FormEvent, type ChangeEvent } from "react";
import LabeledInput from "./LabeledInput";
import PrimaryButton from "../components/FormButton";

export type ExpenseAddFormValues = {
  payerEmail: string;
  amount: number;
  currency: string;
  description: string;
  occurredAt: string;
};

interface ExpenseAddFormProps {
  onSubmit: (
    values: ExpenseAddFormValues,
    e: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
}

const ExpenseAddForm = ({ onSubmit }: ExpenseAddFormProps) => {
  const [payerEmail, setPayerEmail] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("CAD");
  const [description, setDescription] = useState<string>("");
  const [occurredAt, setOccurredAt] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    onSubmit(
      { payerEmail, amount: parsedAmount, currency, description, occurredAt },
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
        id="amount"
        label="Amount"
        placeholder="Enter amount"
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

      <LabeledInput
        id="description"
        label="Description"
        placeholder="What was this expense for?"
        value={description}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setDescription(e.target.value)
        }
        type="text"
        autoComplete="off"
        required
      />

      <LabeledInput
        id="occurredAt"
        label="Date"
        placeholder="Select date/time"
        value={occurredAt}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setOccurredAt(e.target.value)
        }
        type="datetime-local"
        required
      />

      <div className="flex justify-center mt-4">
        <PrimaryButton label="Add Expense" />
      </div>
    </form>
  );
};

export default ExpenseAddForm;

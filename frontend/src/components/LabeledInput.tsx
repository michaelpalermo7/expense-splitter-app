import type { ChangeEvent, InputHTMLAttributes } from "react";

interface LabeledInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const LabeledInput = ({
  id,
  label,
  value,
  onChange,
  className,
  ...rest
}: LabeledInputProps) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-gray-700 text-sm font-medium mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        className={`w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className ?? ""}`}
        {...rest}
      />
    </div>
  );
};

export default LabeledInput;

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
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        className={`w-full rounded-md border border-gray-300 px-3 py-2 outline-none
                    focus:border-gray-500 focus:ring-2 focus:ring-gray-300 ${className ?? ""}`}
        {...rest}
      />
    </div>
  );
};

export default LabeledInput;

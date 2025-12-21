import { useState, type ChangeEvent, type InputHTMLAttributes } from "react";

interface LabeledInputBigProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const LabeledInputBig = ({
  id,
  label,
  value,
  onChange,
  className,
  ...rest
}: LabeledInputBigProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full pb-2 text-2xl font-semibold border-b border-gray-200 
                    focus:border-gray-400 focus:outline-none transition-colors duration-150
                    ${isFocused || value ? "text-black" : "text-gray-400"} ${className ?? ""}`}
        {...rest}
      />
    </div>
  );
};

export default LabeledInputBig;

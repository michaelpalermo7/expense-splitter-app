import type { MouseEventHandler } from "react";

interface FormButtonProps {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const FormButton = ({ label, onClick }: FormButtonProps) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="cursor-pointer inline-flex items-center gap-2
                     bg-black text-white border border-black
                     hover:bg-transparent hover:text-black
                     focus:ring-4 focus:outline-none focus:ring-gray-400
                     font-medium rounded-lg text-sm px-5 py-2.5
                     transition-all duration-200"
    >
      {label}
    </button>
  );
};

export default FormButton;

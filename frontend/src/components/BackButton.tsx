import type { MouseEventHandler } from "react";

interface FormButtonProps {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const FormButton = ({ label, onClick }: FormButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full cursor-pointer inline-flex items-center justify-center gap-2
           bg-transparent text-black border border-black
           hover:bg-gray-100
           focus:outline-none 
           font-medium rounded-3xl text-md px-5 py-4
           transition-all duration-200"
    >
      {label}
    </button>
  );
};

export default FormButton;

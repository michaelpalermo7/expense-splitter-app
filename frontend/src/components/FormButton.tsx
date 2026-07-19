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
      className="w-full cursor-pointer inline-flex items-center justify-center gap-2
           bg-black text-white border border-black
           hover:bg-transparent hover:text-black
            focus:outline-none 
           font-medium rounded-lg text-md px-5 py-4
           transition-all duration-200"
    >
      {label}
    </button>
  );
};

export default FormButton;

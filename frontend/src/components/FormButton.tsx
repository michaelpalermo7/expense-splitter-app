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
      className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
    >
      {label}
    </button>
  );
};

export default FormButton;

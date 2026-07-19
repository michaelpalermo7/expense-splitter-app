import { useState, type FormEvent } from "react";
import MemberChipsInput from "./MemberChips";
import FormButton from "./FormButton";
import BackButton from "./BackButton";
import { useNavigate } from "react-router-dom";

export type MemberAddFormValues = {
  memberNames: string[];
};

interface MemberAddFormProps {
  onSubmit: (
    values: MemberAddFormValues,
    e: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
}

const MemberAddForm = ({ onSubmit }: MemberAddFormProps) => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ memberNames: members }, e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 lg:p-8">
      <MemberChipsInput
        label="Member Name(s)"
        placeholder="Olivia"
        value={members}
        onChange={setMembers}
      />

      <div className="flex flex-col items-center gap-3 mt-6">
        <FormButton label="Add Member(s)" />
        <BackButton label="Back" onClick={() => navigate(-1)} />
      </div>
    </form>
  );
};

export default MemberAddForm;

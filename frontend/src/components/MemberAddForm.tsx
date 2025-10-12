import { useState, type FormEvent, type ChangeEvent } from "react";
import LabeledInput from "./LabeledInput";
import PrimaryButton from "./FormButton";

export type MemberAddFormValues = {
  userName: string;
  userEmail: string;
  userRole: string;
};

interface MemberAddFormProps {
  onSubmit: (
    values: MemberAddFormValues,
    e: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
}

const MemberAddForm = ({ onSubmit }: MemberAddFormProps) => {
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ userName, userEmail, userRole }, e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <LabeledInput
        id="user-name"
        label="User Name"
        placeholder="Enter user name"
        value={userName}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setUserName(e.target.value)
        }
        type="text"
        autoComplete="name"
        required
      />

      <LabeledInput
        id="user-email"
        label="User Email"
        placeholder="Enter user email"
        value={userEmail}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setUserEmail(e.target.value)
        }
        type="email"
        autoComplete="email"
        required
      />

      <LabeledInput
        id="user-role"
        label="User Role"
        placeholder='e.g. "MEMBER" or "ADMIN"'
        value={userRole}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setUserRole(e.target.value)
        }
        type="text"
        autoComplete="off"
        required
      />

      <div className="flex justify-center">
        <PrimaryButton label="Add Member" />
      </div>
    </form>
  );
};

export default MemberAddForm;

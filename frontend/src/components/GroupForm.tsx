import { useState, type FormEvent, type ChangeEvent } from "react";
import LabeledInput from "./LabeledInput";
import PrimaryButton from "./FormButton";

export type GroupFormValues = {
  name: string;
  userName: string;
  userEmail: string;
};

interface GroupFormProps {
  onSubmit: (
    values: GroupFormValues,
    e: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
}

const GroupForm = ({ onSubmit }: GroupFormProps) => {
  const [name, setName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ name, userName, userEmail }, e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <LabeledInput
        id="group-name"
        label="Group Name"
        placeholder="Enter group name"
        value={name}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        type="text"
        autoComplete="organization"
        required
      />

      <LabeledInput
        id="admin-name"
        label="Admin Name"
        placeholder="Enter admin name"
        value={userName}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setUserName(e.target.value)
        }
        type="text"
        autoComplete="name"
        required
      />

      <LabeledInput
        id="admin-email"
        label="Admin Email"
        placeholder="Enter admin email"
        value={userEmail}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setUserEmail(e.target.value)
        }
        type="email"
        autoComplete="email"
        required
      />

      <div className="flex justify-center">
        <PrimaryButton label="Add Group" />
      </div>
    </form>
  );
};

export default GroupForm;

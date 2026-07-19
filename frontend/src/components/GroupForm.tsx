import { useState, type FormEvent } from "react";
import PrimaryButton from "./FormButton";
import MemberChipsInput from "./MemberChips";
import LabeledInputBig from "./LabeledInputBig";

export type CreateGroupFormValues = {
  groupName: string;
  memberNames: string[];
};

interface GroupFormProps {
  onSubmit: (
    values: CreateGroupFormValues,
    e: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
}

export default function GroupForm({ onSubmit }: GroupFormProps) {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ groupName: groupName.trim(), memberNames: members }, e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 lg:p-8">
      <LabeledInputBig
        id="group-name"
        label="Group Name"
        placeholder="Trip to NYC"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        type="text"
        autoComplete="organization"
        required
      />

      <MemberChipsInput
        label="Member Name(s)"
        placeholder="Olivia"
        value={members}
        onChange={setMembers}
      />

      <div className="flex flex-col items-center gap-3 mt-6">
        <PrimaryButton label="Create Group" />
      </div>
    </form>
  );
}

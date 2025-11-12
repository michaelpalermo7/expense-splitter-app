import { useState, type FormEvent } from "react";
import LabeledInput from "./LabeledInput";
import PrimaryButton from "./FormButton";
import MemberChipsInput from "./MemberChips";

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
    <form onSubmit={handleSubmit} className="space-y-5 p-4">
      <LabeledInput
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
        label="Member Name"
        placeholder="Olivia"
        value={members}
        onChange={setMembers}
      />

      <div className="flex justify-center pt-8">
        <PrimaryButton label="Create Group" />
      </div>
    </form>
  );
}

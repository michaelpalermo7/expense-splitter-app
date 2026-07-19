import type { FormEvent } from "react";
import ExpenseAddForm, {
  type ExpenseAddFormValues,
} from "../../components/ExpenseAddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getGroupMembersByToken } from "../../services/GroupService";
import { addExpenseByToken } from "../../services/ExpenseService";

type MemberDTO = { membershipId: number; groupId: number; displayName: string };

const ExpenseAddPage = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [members, setMembers] = useState<MemberDTO[]>([]);

  useEffect(() => {
    if (!token) return;
    getGroupMembersByToken(token).then((res) => setMembers(res.data));
  }, [token]);

  const handleCreate = async (
    values: ExpenseAddFormValues,
    _e: FormEvent<HTMLFormElement>
  ) => {
    if (!token) return;

    // convert to ISO string because backend expects that format
    const payload = {
      ...values,
      occurredAt: new Date(values.occurredAt).toISOString(),
    };

    await addExpenseByToken(token, payload);
    navigate(`/group/${token}`);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <div className="w-full mx-auto">
          <ExpenseAddForm
            onSubmit={handleCreate}
            members={members.map((m) => ({
              membershipId: m.membershipId,
              displayName: m.displayName,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseAddPage;

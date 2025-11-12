import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SettlementAddForm, {
  type SettlementAddFormValues,
} from "../../components/SettlementAddForm";
import { getGroupMembersByToken } from "../../services/GroupService";
import { addSettlementByToken } from "../../services/ExpenseService";

type MemberDTO = { membershipId: number; groupId: number; displayName: string };

const SettlementAddPage = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [members, setMembers] = useState<MemberDTO[]>([]);

  useEffect(() => {
    if (!token) return;
    getGroupMembersByToken(token).then((res) => setMembers(res.data));
  }, [token]);

  const handleCreate = async (
    values: SettlementAddFormValues,
    _e: FormEvent<HTMLFormElement>
  ) => {
    if (!token) return;
    await addSettlementByToken(token, values);
    navigate(`/group/${token}`);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <div className="w-full mx-auto">
          <SettlementAddForm
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

export default SettlementAddPage;

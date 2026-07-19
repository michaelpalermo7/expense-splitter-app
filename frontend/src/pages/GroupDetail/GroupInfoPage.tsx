import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Wallet } from "lucide-react";

import { useGroupInfo } from "../../hooks/useGroupInfo";
import { useGroupBalancesByToken } from "../../hooks/useGroupBalances";
import { useGroupExpensesByToken } from "../../hooks/useGroupExpenses";
import { useGroupSettlementsByToken } from "../../hooks/useGroupSettlements";

import MemberList from "../../components/MemberList";
import ExpensesList from "../../components/ExpenseTable";
import BalancesList from "../../components/BalancesTable";
import SettlementsList from "../../components/SettlementsList";

import { UserPlus, RefreshCw } from "lucide-react";
import FormButton from "../../components/FormButton";
import { rotateInviteLink } from "../../services/GroupService";

const GroupInfoPage = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const { group, members, notFound, deleteMember } = useGroupInfo(token);
  const { expenses } = useGroupExpensesByToken(token);
  const { settlements } = useGroupSettlementsByToken(token);
  const { balances } = useGroupBalancesByToken(token);

  const addMember = () => token && navigate(`/add-member/${token}`);
  const addExpense = () => token && navigate(`/add-expense/${token}`);
  const handleSettle = () => token && navigate(`/add-settlement/${token}`);
  const handleResetLink = async () => {
    if (!token) return;
    const res = await rotateInviteLink(token);
    navigate(`/group/${res.data}/share`, { state: { reset: true } });
  };

  const nameById = useMemo(
    () =>
      Object.fromEntries(members.map((m) => [m.membershipId, m.displayName])),
    [members]
  );

  const hasExpenses = (expenses ?? []).length > 0;

  if (notFound) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Group not found</h2>
        <p className="text-gray-500">
          This link is invalid or has been reset.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-4 py-2 text-sm border border-black text-black rounded-lg
           hover:bg-black hover:text-white transition-all duration-200 cursor-pointer"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-3xl font-bold">{group?.groupName}</h2>

        <button
          onClick={addMember}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                 border border-black text-black rounded-lg
                 hover:bg-black hover:text-white 
                 transition-all duration-200 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      <MemberList
        members={members.map((m) => ({
          membershipId: m.membershipId,
          displayName: m.displayName,
        }))}
        onDelete={(mid) => deleteMember(mid)}
      />

      <div className="mt-6 w-full mb-6">
        <FormButton label="Add Expense" onClick={addExpense} />
      </div>
      <hr className="h-px my-6 bg-gray-200 border-0" />

      <div className="mt-2 mb-6">
        <ExpensesList expenses={expenses} nameById={nameById} />
      </div>

      {hasExpenses && (
        <>
          <div className="flex justify-end mb-3">
            <button
              onClick={handleSettle}
              className="flex items-center gap-2 cursor-pointer px-3 py-1.5 text-sm border border-black text-black rounded-lg
           hover:bg-black hover:text-white
           transition-all duration-200"
              aria-label="Settle up"
            >
              <Wallet className="w-4 h-4" />
              <span>Settle</span>
            </button>
          </div>

          <BalancesList balances={balances} nameById={nameById} />
          <hr className="h-px my-6 bg-gray-200 border-0" />
          <h2 className="text-sm mb-3 mt-6">
            Settlement History
          </h2>
          <div className="mt-3">
            <SettlementsList settlements={settlements} nameById={nameById} />
          </div>
        </>
      )}

      <hr className="h-px my-6 bg-gray-200 border-0" />
      <div className="flex justify-center">
        <button
          onClick={handleResetLink}
          className="flex items-center gap-2 cursor-pointer px-3 py-1.5 text-sm text-black
           hover:text-red-600
           transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Group Link</span>
        </button>
      </div>
    </div>
  );
};

export default GroupInfoPage;

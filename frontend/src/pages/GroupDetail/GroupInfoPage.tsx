import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGroupInfo } from "../../hooks/useGroupInfo";
import { useGroupBalancesByToken } from "../../hooks/useGroupBalances";
import { useGroupExpensesByToken } from "../../hooks/useGroupExpenses";
import { useGroupSettlementsByToken } from "../../hooks/useGroupSettlements";

import MemberList from "../../components/MemberList";
import ExpensesList from "../../components/ExpenseTable";
import BalancesList from "../../components/BalancesTable";
import SettlementsList from "../../components/SettlementsList";

import { UserPlus } from "lucide-react";
import FormButton from "../../components/FormButton";

const GroupInfoPage = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const { group, members, deleteMember } = useGroupInfo(token);
  const { expenses } = useGroupExpensesByToken(token);
  const { settlements } = useGroupSettlementsByToken(token);
  const { balances } = useGroupBalancesByToken(token);

  const addMember = () => token && navigate(`/add-member/${token}`);
  const addExpense = () => token && navigate(`/add-expense/${token}`);
  const handleSettle = () => token && navigate(`/add-settlement/${token}`);

  const nameById = useMemo(
    () =>
      Object.fromEntries(members.map((m) => [m.membershipId, m.displayName])),
    [members]
  );

  const hasExpenses = (expenses ?? []).length > 0;

  return (
    <div className="p-6 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-3xl font-bold">{group?.groupName}</h2>
        <button
          onClick={addMember}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium border border-black text-black rounded-full
               hover:bg-black hover:text-white transition-all duration-200"
        >
          <UserPlus className="w-4 h-4" />
        </button>
      </div>

      <MemberList
        members={members.map((m) => ({
          membershipId: m.membershipId,
          displayName: m.displayName,
        }))}
        onDelete={(mid) => deleteMember(mid)}
      />

      <div className="mt-6 w-full  mb-6">
        <FormButton label="Add Expense" onClick={addExpense} />
      </div>
      <hr className="h-px my-6 bg-gray-200 border-0" />

      <div className="mt-2 mb-10">
        <ExpensesList expenses={expenses} nameById={nameById} />
      </div>

      {hasExpenses && (
        <>
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleSettle}
              className="cursor-pointer px-3 py-1.5 text-sm border border-black text-black rounded-full 
             hover:bg-black hover:text-white 
             focus:ring-4 focus:outline-none focus:ring-gray-400 
             transition-all duration-200"
              aria-label="Settle up"
            >
              Settle up
            </button>
          </div>

          <BalancesList balances={balances} nameById={nameById} />
          <hr className="h-px my-6 bg-gray-200 border-0" />
          <h2 className="text-center text-sm font-semibold mb-2 mt-6">
            Settlement History
          </h2>
          <div className="mt-3">
            <SettlementsList settlements={settlements} nameById={nameById} />
          </div>
        </>
      )}
    </div>
  );
};

export default GroupInfoPage;

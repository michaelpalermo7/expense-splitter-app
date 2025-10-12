import { useNavigate, useParams } from "react-router-dom";
import { useGroupInfo } from "../../hooks/useGroupInfo";
import MemberList from "../../components/MemberList";
import ExpensesList from "../../components/ExpenseTable";
import { useGroupExpenses } from "../../hooks/useGroupExpenses";
import { useMemo } from "react";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BalancesList from "../../components/BalancesTable";
import { useGroupBalances } from "../../hooks/useGroupBalances";

const GroupInfoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { group, members, deleteMember } = useGroupInfo(id);
  const { expenses } = useGroupExpenses(id);

  const addMember = () => {
    if (!id) return;
    navigate(`/add-member/${id}`);
  };

  const addExpense = () => {
    if (!id) return;
    navigate(`/add-expense/${id}`);
  };

  const handleSettle = () => {
    if (!id) return;
    navigate(`/add-settlement/${id}`);
  };

  const nameById = useMemo(
    () => Object.fromEntries(members.map((m) => [m.userId, m.userName])),
    [members]
  );

  const { balances } = useGroupBalances(id);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-3">{group?.name}</h2>
      <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-300" />

      <div className="mb-4 text-left">
        <h2 className="text-left text-lg font-medium mb-2">Members:</h2>
      </div>
      <MemberList members={members} onDelete={deleteMember} />
      <button
        onClick={addMember}
        className="cursor-pointer inline-flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <PersonAddIcon fontSize="small" />
        ADD
      </button>

      <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-300" />
      <h2 className="text-left text-lg font-medium mb-2 mt-6">Expenses:</h2>
      <div className="mt-2 mb-10">
        <ExpensesList expenses={expenses} nameById={nameById} />
      </div>
      <button
        onClick={addExpense}
        className="cursor-pointer inline-flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <AddShoppingCartIcon fontSize="small" />
        ADD
      </button>

      <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-300" />
      <h2 className="text-left text-lg font-medium mb-2 mt-6">Balances:</h2>
      <BalancesList balances={balances} nameById={nameById} />

      <button
        onClick={handleSettle}
        className="mt-10 cursor-pointer inline-flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <AccountBalanceWalletIcon fontSize="small" />
        SETTLE
      </button>
    </div>
  );
};

export default GroupInfoPage;

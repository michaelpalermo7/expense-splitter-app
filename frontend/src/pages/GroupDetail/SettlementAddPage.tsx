import type { FormEvent } from "react";
import type { SettlementAddFormValues } from "../../components/SettlementAddForm";
import { useNavigate, useParams } from "react-router-dom";
import SettlementAddForm from "../../components/SettlementAddForm";
import { addGroupSettlement } from "../../services/ExpenseService";

const SettlementAddPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);

  const handleCreate = async (
    values: SettlementAddFormValues,
    _e: FormEvent<HTMLFormElement>
  ) => {
    const { payerEmail, payeeEmail, amount, currency } = values;

    await addGroupSettlement(groupId, {
      payerEmail,
      payeeEmail,
      amount,
      currency,
    });

    navigate(`/group-info/${groupId}`);
  };

  return (
    <div className="container mx-auto px-4">
      <br />
      <br />
      <div className="flex justify-center">
        <div className="w-full md:w-1/2 bg-white">
          <div className="p-6">
            <h2 className="text-center text-2xl font-semibold mb-6">
              Add Settlement
            </h2>
            <SettlementAddForm onSubmit={handleCreate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettlementAddPage;

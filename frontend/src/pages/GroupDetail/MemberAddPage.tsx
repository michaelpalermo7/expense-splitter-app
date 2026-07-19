import type { FormEvent } from "react";
import type { MemberAddFormValues } from "../../components/MemberAddForm";
import { useNavigate, useParams } from "react-router-dom";
import MemberAddForm from "../../components/MemberAddForm";
import {
  addGroupMemberByToken,
  addMembersBulkByToken,
} from "../../services/GroupService";
import OwlIcon from "../../assets/Owlicon.png";
import GraphicImage from "../../components/GraphicImage";
const MemberAddPage = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const handleCreate = async (
    values: MemberAddFormValues,
    _e: FormEvent<HTMLFormElement>
  ) => {
    if (!token) return;

    const names = (values.memberNames ?? [])
      .map((s) => s.trim())
      .filter(Boolean);
    if (!names.length) return;

    if (names.length === 1) {
      await addGroupMemberByToken(token, { displayName: names[0] });
    } else {
      await addMembersBulkByToken(token, names);
    }

    navigate(`/group/${token}`);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <MemberAddForm onSubmit={handleCreate} />
      </div>

      <div className="mt-8 w-48">
        <GraphicImage src={OwlIcon} alt="Owl icon" />
      </div>
    </div>
  );
};

export default MemberAddPage;

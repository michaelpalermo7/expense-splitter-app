import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import GroupForm, {
  type CreateGroupFormValues,
} from "../../components/GroupForm";
import {
  createGroup,
  addMemberByToken,
  addMembersBulkByToken,
} from "../../services/GroupService";
import OwlIcon from "../../assets/Owlicon.png";
import GraphicImage from "../../components/GraphicImage";

const GroupAddPage = () => {
  const navigate = useNavigate();

  const handleCreate = async (
    values: CreateGroupFormValues,
    _e: FormEvent<HTMLFormElement>
  ) => {
    const { groupName, memberNames } = values;

    const created = await createGroup({ groupName });
    const token = created.data.inviteToken;

    if (memberNames?.length) {
      if (memberNames.length === 1) {
        await addMemberByToken(token, memberNames[0]);
      } else {
        await addMembersBulkByToken(token, memberNames);
      }
    }

    navigate(`/group/${token}/share`);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        <GroupForm onSubmit={handleCreate} />
      </div>
      <div className="mt-8 w-50">
        <GraphicImage src={OwlIcon} alt="" />
      </div>
    </div>
  );
};

export default GroupAddPage;

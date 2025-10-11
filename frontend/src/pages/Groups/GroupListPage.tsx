import { useNavigate } from "react-router-dom";
import GroupTable from "../../components/GroupTable";
import { useGroups } from "../../hooks/useGroup";

const GroupList = () => {
  const { groups } = useGroups();
  const navigate = useNavigate();

  //direct to add page
  const addNewGroup = () => {
    navigate("/add-group");
  };

  //direct to info page
  const groupInfo = (id: number) => {
    navigate(`/group-info/${id}`);
  };

  const deleteGroup = (_id: number) => {
    //TODO: Group deletion frontend call to api
  };

  return (
    <GroupTable
      groups={groups}
      onAdd={addNewGroup}
      onInfo={groupInfo}
      onDelete={deleteGroup}
    />
  );
};

export default GroupList;

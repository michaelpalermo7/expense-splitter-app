import { useNavigate } from "react-router-dom";
import GroupTable from "../../components/GroupTable";
import { useGroups } from "../../hooks/useGroup";
import { deleteGroup } from "../../services/GroupService";
import { useEffect, useState } from "react";

const GroupList = () => {
  const { groups } = useGroups();
  const navigate = useNavigate();
  const [rows, setRows] = useState(groups);

  useEffect(() => {
    setRows(groups);
  }, [groups]);

  const addNewGroup = () => {
    navigate("/add-group");
  };

  const groupInfo = (id: number) => {
    navigate(`/group-info/${id}`);
  };

  const handleDeleteGroup = async (id: number) => {
    await deleteGroup(id);
    setRows((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <GroupTable
      groups={rows}
      onAdd={addNewGroup}
      onInfo={groupInfo}
      onDelete={handleDeleteGroup}
    />
  );
};

export default GroupList;

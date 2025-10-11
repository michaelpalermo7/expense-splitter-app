import { useParams } from "react-router-dom";
import { useGroupInfo } from "../../hooks/useGroupInfo";
import MemberList from "../../components/MemberList";

const GroupInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const { group, members, deleteMember } = useGroupInfo(id);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">{group?.name}</h2>
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      <MemberList members={members} onDelete={deleteMember} />
    </div>
  );
};

export default GroupInfoPage;

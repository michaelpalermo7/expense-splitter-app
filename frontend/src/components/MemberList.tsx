import type { MemberWithName } from "../types";
import DeleteIcon from "@mui/icons-material/Delete";

type MembersListProps = {
  members: MemberWithName[];
  onDelete: (userId: number) => void;
};

const MembersList = ({ members, onDelete }: MembersListProps) => {
  return (
    <>
      <h2 className="text-left text-lg font-medium mb-2">Members:</h2>
      <ul className="list-disc pl-6">
        {members.map((m) => (
          <li key={m.userId} className="py-1 flex items-center justify-between">
            <div>
              <span className="font-medium">{m.userName}</span>
              <span className="ml-3 text-gray-500">({m.role})</span>
            </div>
            <button
              onClick={() => onDelete(m.userId)}
              className="text-red-500 hover:text-red-700 cursor-pointer"
            >
              <DeleteIcon fontSize="small" />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default MembersList;

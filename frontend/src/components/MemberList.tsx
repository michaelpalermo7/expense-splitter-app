import type { MemberWithName } from "../types";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

type MembersListProps = {
  members: MemberWithName[];
  onDelete: (userId: number) => void;
};

const MembersList = ({ members, onDelete }: MembersListProps) => {
  return (
    <ul className="list-none pl-2">
      {members.map((m) => (
        <li
          key={m.userId}
          className="flex items-center justify-between py-2 pr-3"
        >
          <div className="flex items-center">
            <span className="font-medium text-gray-900">{m.userName}</span>
            <span className="ml-2 text-gray-500 text-sm">({m.role})</span>
          </div>

          <button
            onClick={() => onDelete(m.userId)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title={`Remove ${m.userName}`}
          >
            <DeleteForeverIcon fontSize="small" />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default MembersList;

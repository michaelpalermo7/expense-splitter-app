import type { MemberWithName } from "../types";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

type MembersListProps = {
  members: MemberWithName[];
  onDelete: (userId: number) => void;
};

const badgeClass = (role?: string) =>
  (role ?? "").toUpperCase() === "ADMIN"
    ? "bg-blue-50 text-blue-700"
    : "bg-gray-100 text-gray-700";

const MembersList = ({ members, onDelete }: MembersListProps) => {
  return (
    <ul className="list-none pl-0">
      {members.map((m) => (
        <li
          key={m.userId}
          className="flex items-center justify-between gap-4 py-2 px-1"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <p className="truncate font-medium text-gray-900">{m.userName}</p>
            <span
              className={`shrink-0 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${badgeClass(
                m.role
              )}`}
            >
              {(m.role ?? "").toUpperCase()}
            </span>
          </div>

          <button
            onClick={() => onDelete(m.userId)}
            title={`Remove ${m.userName}`}
            className="inline-flex items-center gap-2 rounded-lg border border-red-700 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors"
          >
            <DeleteForeverIcon fontSize="small" />
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};

export default MembersList;

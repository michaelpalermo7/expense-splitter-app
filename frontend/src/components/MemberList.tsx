import type { GroupMember } from "../types";
import { X } from "lucide-react";

type MembersListProps = {
  members: Pick<GroupMember, "membershipId" | "displayName">[];
  onDelete: (membershipId: number) => void;
};

const MembersList = ({ members, onDelete }: MembersListProps) => {
  return (
    <ul className="flex flex-wrap items-center gap-y-1 text-sm text-gray-700 p-0 m-0">
      {members.map((m, i) => (
        <li key={m.membershipId} className="inline-flex items-center">
          <span className="inline-flex items-center">
            <span className="font-medium text-gray-900">{m.displayName}</span>
            <button
              onClick={() => onDelete(m.membershipId)}
              aria-label={`Remove ${m.displayName}`}
              title={`Remove ${m.displayName}`}
              className="cursor-pointer ml-1 p-0.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>

          {i < members.length - 1 && (
            <span aria-hidden="true" className="mx-2 text-gray-400">
              •
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MembersList;

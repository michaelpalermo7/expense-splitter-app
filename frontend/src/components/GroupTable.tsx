import type { Group } from "../types";
import { fmtDate } from "../utils/date";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddIcon from "@mui/icons-material/Add";

type GroupsTableProps = {
  groups: Group[];
  onAdd: () => void;
  onInfo: (id: number) => void;
  onDelete: (id: number) => void;
};

const GroupsTable = ({ groups, onAdd, onInfo, onDelete }: GroupsTableProps) => {
  return (
    <div className="relative overflow-x-auto shadow-sm sm:rounded-lg bg-white hover:shadow-md">
      <h2 className="text-2xl font-semibold  text-center p-4">Your Groups</h2>

      <div className="mb-1 pb-2 flex justify-start">
        <button
          type="button"
          onClick={onAdd}
          className="cursor-pointer inline-flex items-center gap-2
                     bg-black text-white border border-black
                     hover:bg-transparent hover:text-black
                     focus:ring-4 focus:outline-none focus:ring-gray-400
                     font-medium rounded-lg text-sm px-5 py-2.5
                     transition-all duration-200"
        >
          <AddIcon fontSize="small" />
          Add Group
        </button>
      </div>

      <table className="w-full table-fixed text-lg text-left text-gray-700">
        <colgroup>
          <col className="w-1/4" />
          <col className="w-1/4" />
          <col className="w-1/4" />
          <col className="w-1/4" />
        </colgroup>

        <thead className="text-md text-white uppercase bg-black">
          <tr>
            <th className="px-6 py-3 text-xs tracking-wide opacity-90 font-normal">
              Group Id
            </th>
            <th className="px-6 py-3 text-xs tracking-wide opacity-90 font-normal">
              Group Name
            </th>
            <th className="px-6 py-3 text-xs tracking-wide opacity-90 font-normal">
              Group Created At
            </th>
            <th className="px-6 py-3 text-xs tracking-wide opacity-90 text-right font-normal">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="text-[15px]">
          {groups.length === 0 ? (
            <tr className="bg-white">
              <td className="px-6 py-6 text-gray-500" colSpan={4}>
                No groups yet.
              </td>
            </tr>
          ) : (
            groups.map((group) => (
              <tr key={group.id} className="bg-white border-none">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {group.id}
                </td>
                <td className="px-6 py-4">
                  <span className="block truncate text-gray-700 font-medium">
                    {group.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {fmtDate(group.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onInfo(group.id)}
                      title="Info"
                      aria-label="Info"
                      className="cursor-pointer inline-flex items-center gap-2 text-blue-700 border border-blue-700 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 transition-colors"
                    >
                      <InfoOutlinedIcon fontSize="small" />
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(group.id)}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-red-700 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors"
                    >
                      <DeleteForeverIcon fontSize="small" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GroupsTable;

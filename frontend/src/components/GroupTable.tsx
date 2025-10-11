import type { Group } from "../types";
import { fmtDate } from "../utils/date";

type GroupsTableProps = {
  groups: Group[];
  onAdd: () => void;
  onInfo: (id: number) => void;
  onDelete: (id: number) => void;
};

const GroupsTable = ({ groups, onAdd, onInfo, onDelete }: GroupsTableProps) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
      <h2 className="text-3xl font-semibold text-gray-800 p-4">
        List Of Groups
      </h2>

      <button
        type="button"
        onClick={onAdd}
        className="cursor-pointer float-left text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Add Group
      </button>

      <table className="w-full text-lg text-left rtl:text-right text-gray-700">
        <thead className="text-md text-gray-800 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3">
              Group Id
            </th>
            <th scope="col" className="px-6 py-3">
              Group Name
            </th>
            <th scope="col" className="px-6 py-3">
              Group Created At
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {groups.map((group, index) => (
            <tr
              key={group.id}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} border-none`}
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {group.id}
              </td>
              <td className="px-6 py-4">{group.name}</td>
              <td className="px-6 py-4">{fmtDate(group.createdAt)}</td>
              <td className="px-6 py-4 space-x-2">
                <button
                  type="button"
                  onClick={() => onInfo(group.id)}
                  className="cursor-pointer text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                >
                  Info
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(group.id)}
                  className="cursor-pointer text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupsTable;

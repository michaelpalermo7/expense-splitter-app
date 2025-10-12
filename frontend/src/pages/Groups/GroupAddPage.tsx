import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import GroupForm, { type GroupFormValues } from "../../components/GroupForm";
import { createUser, getUserByEmail } from "../../services/UserService";
import { createGroup } from "../../services/GroupService";

const GroupAddPage = () => {
  const navigate = useNavigate();

  const handleCreate = async (
    values: GroupFormValues,
    _e: FormEvent<HTMLFormElement>
  ) => {
    const { userName, userEmail, name } = values;

    let creatorUserId: number;

    //see if user exists, if not create them
    try {
      const res = await getUserByEmail(userEmail);
      creatorUserId = res.data.userId;
    } catch (err: any) {
      if (err?.response?.status !== 404) {
        throw err;
      }
      const created = await createUser({ userName, userEmail });
      creatorUserId = created.data.userId;
    }

    // use that new user id to create a group with that user in it as admin
    await createGroup({
      name,
      creatorUserId,
    });

    navigate("/groups");
  };

  return (
    <div className="container mx-auto px-4">
      <br />
      <br />
      <div className="flex justify-center">
        <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg">
          <div className="p-6">
            <h2 className="text-center text-2xl font-semibold mb-6">
              Add Group
            </h2>
            <GroupForm onSubmit={handleCreate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupAddPage;

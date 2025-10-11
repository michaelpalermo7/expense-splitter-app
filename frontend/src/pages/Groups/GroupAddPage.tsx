import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import GroupForm, { type GroupFormValues } from "../../components/GroupForm";
import { createUser } from "../../services/UserService";
import { createGroup } from "../../services/GroupService";

const GroupAddPage = () => {
  const navigate = useNavigate();

  const handleCreate = async (
    values: GroupFormValues,
    _e: FormEvent<HTMLFormElement>
  ) => {
    const { userName, userEmail, name } = values;

    // create user, and get response data that has user id
    const { data: newUser } = await createUser({
      userName,
      userEmail,
    });

    // use that new user id to create a group with that user in it as admin
    await createGroup({
      name,
      creatorUserId: newUser.userId,
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

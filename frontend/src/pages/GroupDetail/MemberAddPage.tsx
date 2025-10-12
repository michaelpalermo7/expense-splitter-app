/* This is where user adding logic will reside */

import type { FormEvent } from "react";
import type { MemberAddFormValues } from "../../components/MemberAddForm";
import { createUser, getUserByEmail } from "../../services/UserService";
import { useNavigate, useParams } from "react-router-dom";
import MemberAddForm from "../../components/MemberAddForm";
import { addGroupMember } from "../../services/GroupService";

const MemberAddPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);

  const handleCreate = async (
    values: MemberAddFormValues,
    _e: FormEvent<HTMLFormElement>
  ) => {
    const { userName, userEmail, userRole } = values;

    let userId: number;

    //see if user exists, if not create them
    try {
      const res = await getUserByEmail(userEmail);
      userId = res.data.userId;
    } catch (err: any) {
      if (err?.response?.status !== 404) throw err;

      const created = await createUser({ userName, userEmail });
      userId = created.data.userId;
    }

    // add user to group
    await addGroupMember(groupId, {
      userId,
      role: userRole.toUpperCase(),
    });

    navigate(`/group-info/${groupId}`);
  };
  return (
    <div className="container mx-auto px-4">
      <br />
      <br />
      <div className="flex justify-center">
        <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg">
          <div className="p-6">
            <h2 className="text-center text-2xl font-semibold mb-6">
              Add Member
            </h2>
            <MemberAddForm onSubmit={handleCreate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberAddPage;

import { useEffect, useState } from "react";
import {
  getGroupById,
  getGroupMembers,
  deleteGroupMember,
} from "../services/GroupService";
import { getUserById } from "../services/UserService";
import type { Group, MemberWithName, GroupMember } from "../types";

export function useGroupInfo(id?: string) {
  const [group, setGroup] = useState<Group>();
  const [members, setMembers] = useState<MemberWithName[]>([]);

  useEffect(() => {
    const groupId = Number(id);

    //fetch group
    getGroupById(groupId).then((res) => setGroup(res.data));

    //fetch members and user info
    getGroupMembers(groupId).then(async (response) => {
      const membersData = response.data;

      const members = await Promise.all(
        membersData.map(async (member: GroupMember) => {
          const userRes = await getUserById(member.userId);
          return { ...member, userName: userRes.data.userName };
        })
      );

      setMembers(members);
    });
  }, [id]);

  const deleteMember = async (userId: number) => {
    if (!id) return;
    await deleteGroupMember(Number(id), userId);

    // remove the member by userId
    const updatedMembers = members.filter((m) => m.userId !== userId);
    setMembers(updatedMembers);
  };

  return { group, members, deleteMember };
}

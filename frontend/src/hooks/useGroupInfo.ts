// hooks/useGroupInfo.ts
import { useEffect, useState } from "react";
import {
  getGroupByToken,
  getGroupMembersByToken,
  deleteGroupMemberByToken,
} from "../services/GroupService";
import type { Group, GroupMember } from "../types";

export function useGroupInfo(token?: string) {
  const [group, setGroup] = useState<Group>();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;

    getGroupByToken(token)
      .then((res) => setGroup(res.data))
      .catch((e) => {
        if (e?.response?.status === 404) setNotFound(true);
      });
    getGroupMembersByToken(token)
      .then((res) => setMembers(res.data))
      .catch(() => {});
  }, [token]);

  const deleteMember = async (membershipId: number) => {
    if (!token) return;
    await deleteGroupMemberByToken(token, membershipId);
    setMembers((cur) => cur.filter((m) => m.membershipId !== membershipId));
  };

  return { group, members, notFound, deleteMember };
}

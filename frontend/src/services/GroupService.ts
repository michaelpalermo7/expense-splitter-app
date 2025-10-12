import { api } from "./client";
import type {
  AddMemberRequest,
  Group,
  GroupCreate,
  GroupMember,
} from "../types";

export const listAllGroups = () => api.get<Group[]>("/groups");

export const createGroup = (group: GroupCreate) =>
  api.post<Group>("/groups", group);

export const deleteGroup = (id: number) => {
  return api.delete(`/groups/${id}`);
};

export const getGroupById = (id: number) => {
  return api.get<Group>(`/groups/${id}`);
};

export const getGroupMembers = (id: number) => {
  return api.get<GroupMember[]>(`/groups/${id}/members`);
};

export const deleteGroupMember = (id: number, userId: number) => {
  return api.delete(`/groups/${id}/members/${userId}`);
};

export const addGroupMember = (groupId: number, body: AddMemberRequest) =>
  api.post<GroupMember>(`/groups/${groupId}/members`, body);

import { api } from "./client";
import type { Group, GroupMember } from "../types";

export async function createGroup(payload: { groupName: string }) {
  return api.post<Group>("/group", payload);
}

export async function addMemberByToken(token: string, displayName: string) {
  return api.post(`/group/${encodeURIComponent(token)}/members`, {
    displayName,
  });
}

export async function addMembersBulkByToken(token: string, names: string[]) {
  return api.post(`/group/${encodeURIComponent(token)}/members/bulk`, {
    names,
  });
}

export async function getInviteLink(token: string) {
  return api.get<string>(`/group/${encodeURIComponent(token)}/link`);
}

export const getGroupByToken = (token: string) =>
  api.get<Group>(`/group/${encodeURIComponent(token)}`);

export const getGroupMembersByToken = (token: string) =>
  api.get<GroupMember[]>(`/group/${encodeURIComponent(token)}/members`);

export const deleteGroupMemberByToken = (token: string, membershipId: number) =>
  api.delete(`/group/${encodeURIComponent(token)}/members/${membershipId}`);

export function addGroupMemberByToken(
  token: string,
  data: { displayName: string }
) {
  return api.post(`/group/${token}/members`, data);
}

export function getGroupInviteLink(token: string) {
  return api.get<string>(`/group/${token}/link`);
}

export const deleteGroup = (token: string) =>
  api.delete<void>(`/group/${token}`);

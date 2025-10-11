export interface UserCreate {
  userName: string;
  userEmail: string;
}

export interface User {
  userId: number;
  userName: string;
  userEmail: string;
}

export interface GroupCreate {
  name: string;
  creatorUserId: number;
}

export interface Group {
  id: number;
  name: string;
  createdAt: string;
}

export interface GroupMember {
  id: number;
  userId: number;
  groupId: number;
  role: string;
}

export interface MemberWithName extends GroupMember {
  userName: string;
}

/* ===== USER ===== */
export interface UserCreate {
  userName: string;
  userEmail: string;
}

export interface User {
  userId: number;
  userName: string;
  userEmail: string;
}

/* ===== GROUP ===== */
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

export interface AddMemberRequest {
  userId: number;
  role: string;
}

/* ===== EXPENSES ===== */
export type Share = {
  participantId: number;
  shareAmount: string;
  shareRatio: string;
};

export type Expense = {
  id: number;
  groupId: number;
  payerId: number;
  amount: string;
  currency: string;
  description: string;
  occurredAt: string;
  createdAt: string;
  shares: Share[];
};

export type Balance = {
  userId: number;
  balance: number;
};

export type ExpenseCreate = {
  payerEmail: string;
  amount: number;
  currency: string;
  description: string;
  occurredAt: string;
};

export type SettlementCreate = {
  payerEmail: string;
  payeeEmail: string;
  amount: number;
  currency: string;
};

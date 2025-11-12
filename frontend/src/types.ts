/* ===== GROUP ===== */
export interface GroupCreate {
  groupName: string;
}

export interface Group {
  groupId: number;
  groupName: string;
  groupCreatedAt: string | null;
  inviteToken: string;
}

export type GroupMember = {
  membershipId: number;
  groupId: number;
  displayName: string;
};

export type MemberForUI = GroupMember;

/** Request body for POST /groups/{id}/members */
export interface AddMemberRequest {
  displayName: string;
}

/** Request body for POST /groups/{id}/members/bulk */
export interface CreateMemberRequest {
  names: string[];
}

/* ===== EXPENSES ===== */
export type Share = {
  membershipId: number;
  shareAmount: number;
  shareRatio: number | null;
};

export type Expense = {
  expenseId: number;
  groupId: number;
  payerMembershipId: number;
  amount: number;
  currency: "CAD" | "USD";
  description?: string | null;
  occurredAt: string; // ISO
  createdAt: string; // ISO
  shares?: Share[]; // present in list/detail responses
};

export type Balance = {
  membershipId: number;
  balance: number;
};

export type ExpenseCreate = {
  payerMembershipId: number;
  amount: number;
  currency: "CAD" | "USD";
  description?: string;
  occurredAt: string;
  participantMembershipIds?: number[];
};

/* ===== SETTLEMENTS ===== */
export type SettlementCreate = {
  payerMembershipId: number;
  payeeMembershipId: number;
  amount: number;
  currency: "CAD" | "USD" | "EUR";
};

export type Settlement = {
  id: number;
  payerMembershipId: number;
  payeeMembershipId: number;
  groupId: number;
  amount: number;
  currency: "CAD" | "USD" | "EUR";
  settledAt: string; // ISO
};

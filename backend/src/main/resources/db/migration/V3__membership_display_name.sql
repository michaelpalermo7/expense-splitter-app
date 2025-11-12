-- =========================
-- V3: name-only members & drop users so our design doesnt involve emails/user entities since im making this a loginless design.
-- =========================

-- 0) Drop FKs that point to users so we can change columns
ALTER TABLE membership     DROP CONSTRAINT IF EXISTS fk_membership_user;
ALTER TABLE expenses       DROP CONSTRAINT IF EXISTS fk_expenses_payer;
ALTER TABLE expense_share  DROP CONSTRAINT IF EXISTS fk_expense_share_participant;
ALTER TABLE settlements    DROP CONSTRAINT IF EXISTS fk_settlement_payer;
ALTER TABLE settlements    DROP CONSTRAINT IF EXISTS fk_settlement_payee;

-- 1) Membership: make display_name the identity; drop user_id and role
ALTER TABLE membership
  ADD COLUMN IF NOT EXISTS display_name VARCHAR(100);

-- Require a name
ALTER TABLE membership
  ALTER COLUMN display_name SET NOT NULL;

-- Prevent duplicate names within the same group
CREATE UNIQUE INDEX IF NOT EXISTS ux_membership_group_display_name_ci
  ON membership (group_id, lower(display_name));

-- Remove coupling to users and old uniqueness
ALTER TABLE membership
  DROP CONSTRAINT IF EXISTS uq_membership_user_group;

ALTER TABLE membership
  DROP COLUMN IF EXISTS user_id;

-- Remove roles entirely
ALTER TABLE membership
  DROP COLUMN IF EXISTS role;

-- 2) Expenses: swap payer from users -> membership
--    Drop old payer column and add new FK
ALTER TABLE expenses
  DROP COLUMN IF EXISTS payer_id;

ALTER TABLE expenses
  ADD COLUMN payer_membership_id BIGINT NOT NULL;

ALTER TABLE expenses
  ADD CONSTRAINT fk_expenses_payer_membership
    FOREIGN KEY (payer_membership_id) REFERENCES membership(membership_id) ON DELETE RESTRICT;

-- 3) Expense shares: swap participant from users -> membership
ALTER TABLE expense_share
  DROP CONSTRAINT IF EXISTS uq_expense_share;

ALTER TABLE expense_share
  DROP COLUMN IF EXISTS participant_id;

ALTER TABLE expense_share
  ADD COLUMN membership_id BIGINT NOT NULL;

ALTER TABLE expense_share
  ADD CONSTRAINT fk_expense_share_membership
    FOREIGN KEY (membership_id) REFERENCES membership(membership_id) ON DELETE RESTRICT;

-- Enforce uniqueness per expense/member pair
CREATE UNIQUE INDEX IF NOT EXISTS ux_expense_share_unique
  ON expense_share (expense_id, membership_id);

-- 4) Settlements: swap payer/payee from users -> membership
ALTER TABLE settlements
  DROP COLUMN IF EXISTS payer_id,
  DROP COLUMN IF EXISTS payee_id;

ALTER TABLE settlements
  ADD COLUMN payer_membership_id BIGINT NOT NULL,
  ADD COLUMN payee_membership_id BIGINT NOT NULL;

ALTER TABLE settlements
  ADD CONSTRAINT ck_settlement_not_self_membership
    CHECK (payer_membership_id <> payee_membership_id);

ALTER TABLE settlements
  ADD CONSTRAINT fk_settlement_payer_membership
    FOREIGN KEY (payer_membership_id) REFERENCES membership(membership_id) ON DELETE RESTRICT;

ALTER TABLE settlements
  ADD CONSTRAINT fk_settlement_payee_membership
    FOREIGN KEY (payee_membership_id) REFERENCES membership(membership_id) ON DELETE RESTRICT;

-- 5) Clean up indexes referencing old columns (defensive; no-ops if missing)
DROP INDEX IF EXISTS idx_expenses_payer;
DROP INDEX IF EXISTS idx_expense_share_participant;
DROP INDEX IF EXISTS idx_settlement_payer;
DROP INDEX IF EXISTS idx_settlement_payee;
DROP INDEX IF EXISTS idx_membership_user;

-- 6) Finally: drop users table
DROP TABLE IF EXISTS users CASCADE;

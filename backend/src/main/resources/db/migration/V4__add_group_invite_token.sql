-- =========================
-- V4: shareable invite token to groups
-- =========================
ALTER TABLE groups
  ADD COLUMN IF NOT EXISTS invite_token VARCHAR(64);

-- Ensure pgcrypto is usable (for gen_random_bytes)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  -- base64url: replace +/ with -_ and strip =
  UPDATE groups
     SET invite_token = replace(translate(encode(gen_random_bytes(16), 'base64'), '+/', '-_'), '=', '')
   WHERE invite_token IS NULL;
END
$$;

CREATE UNIQUE INDEX IF NOT EXISTS ux_groups_invite_token ON groups(invite_token);

ALTER TABLE groups
  ALTER COLUMN invite_token SET NOT NULL;

COMMENT ON COLUMN groups.invite_token IS 'Shareable, URL-safe token used to access/join group';

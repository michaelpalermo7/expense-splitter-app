import { useEffect, useMemo, useState } from "react";
import { getGroupByToken, getGroupInviteLink } from "../services/GroupService";
import type { Group } from "../types";

export function useGroupShare(token?: string) {
  const [group, setGroup] = useState<Group | null>(null);
  const [linkToken, setLinkToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (!token) return "";
    return `${window.location.origin}/group/${token}`;
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let alive = true;
    setLoading(true);
    setError(null);

    Promise.all([getGroupByToken(token), getGroupInviteLink(token)])
      .then(([gRes, lRes]) => {
        if (!alive) return;
        setGroup(gRes.data);
        setLinkToken(lRes.data);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.response?.data?.message || "Failed to load group");
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [token]);

  const copyToClipboard = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return {
    group,
    linkToken,
    shareUrl,
    loading,
    error,
    copied,
    copyToClipboard,
  };
}

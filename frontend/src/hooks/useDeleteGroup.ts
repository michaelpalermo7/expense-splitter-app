import { useCallback, useState } from "react";
import { deleteGroup as deleteGroupApi } from "../services/GroupService";

export function useDeleteGroup() {
  const [loading, setLoading] = useState(false);

  const deleteGroup = useCallback(async (token: string) => {
    setLoading(true);
    try {
      await deleteGroupApi(token);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteGroup, loading };
}

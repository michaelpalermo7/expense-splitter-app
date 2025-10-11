import { useEffect, useState } from "react";
import { listAllGroups } from "../services/GroupService";
import type { Group } from "../types";

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    listAllGroups()
      .then((response) => setGroups(response.data))
      .catch((error) => console.error(error));
  }, []);

  return { groups, setGroups };
}

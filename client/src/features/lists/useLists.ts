import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export interface List {
  id: string;
  user_id: string;
  name: string;
  visibility: "private" | "shared";
  created_at: string;
  share_token?: string;
  is_template?: boolean;
}

export function useLists(userId: string | null) {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = async () => {
    setLoading(true);

    try {
      if (!userId) return;

      // Fetch the user's lists
      const { data: ownLists, error: ownError } = await supabase
        .from("lists")
        .select(
          "id, user_id, name, visibility, created_at, share_token, is_template"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (ownError) throw ownError;

      // Fetch shared list IDs from list_collaborators
      const { data: collaboratorLinks, error: linkError } = await supabase
        .from("list_collaborators")
        .select("list_id")
        .eq("user_id", userId);

      if (linkError) throw linkError;

      const collaboratorListIds: string[] =
        collaboratorLinks?.map((link) => link.list_id) || [];
      let sharedLists: List[] = [];

      // Fetch shared lists
      if (collaboratorListIds.length > 0) {
        const { data: sharedData, error: sharedError } = await supabase
          .from("lists")
          .select(
            "id, user_id, name, visibility, created_at, share_token, is_template"
          )
          .in("id", collaboratorListIds)
          .order("created_at", { ascending: false });

        if (sharedError) throw sharedError;

        sharedLists = sharedData as List[];
      }

      // Merge and deduplicate (in case someone is both owner + collaborator)
      const combined = [...(ownLists || []), ...sharedLists];
      const uniqueLists = Array.from(
        new Map(combined.map((item) => [item.id, item])).values()
      );

      setLists(uniqueLists);
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  const addList = async (name: string, visibility: "private" | "shared") => {
    const share_token =
      visibility === "shared" ? crypto.randomUUID().slice(0, 8) : null;

    const { error } = await supabase.from("lists").insert([
      {
        name,
        visibility,
        user_id: userId,
        share_token,
      },
    ]);
    if (!error) fetchLists();
  };

  const deleteList = async (id: string) => {
    const { error } = await supabase.from("lists").delete().eq("id", id);
    if (!error) fetchLists();
  };

  useEffect(() => {
    if (userId) fetchLists();
  }, [userId]);

  return { lists, loading, error, addList, deleteList, fetchLists };
}

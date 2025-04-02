import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export interface ListItem {
  id: string;
  content: string;
  is_checked: boolean;
  created_at: string;
  list_id: string;
}

export function useListItems(listId: string | null) {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("list_items")
      .select("id, content, is_checked, created_at, list_id")
      .eq("list_id", listId)
      .order("created_at", { ascending: true });

    if (error) setError(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  const addItem = async (content: string) => {
    if (!content.trim()) return;
    const { error } = await supabase
      .from("list_items")
      .insert([{ content, list_id: listId }]);
    if (!error) fetchItems();
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("list_items").delete().eq("id", id);
    if (!error) fetchItems();
  };

  const toggleCheck = async (id: string, is_checked: boolean) => {
    const { error } = await supabase
      .from("list_items")
      .update({ is_checked: !is_checked })
      .eq("id", id);
    if (!error) fetchItems();
  };

  useEffect(() => {
    if (listId) fetchItems();
  }, [listId]);

  return { items, loading, error, addItem, deleteItem, toggleCheck };
}

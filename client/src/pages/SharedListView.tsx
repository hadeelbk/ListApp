import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface SharedList {
  id: string;
  name: string;
  visibility: "private" | "shared";
}

interface ListItem {
  id: string;
  content: string;
  is_checked: boolean;
}

export default function SharedListView() {
  const { token } = useParams<{ token: string }>();
  const [list, setList] = useState<SharedList | null>(null);
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSharedList = async () => {
    setLoading(true);

    // Get the list by token (the read-only)
    const { data: listData, error: listError } = await supabase
      .from("lists")
      .select("id, name, visibility")
      .eq("share_token", token)
      .eq("visibility", "shared")
      .single();

    if (listError || !listData) {
      setError("This shared list was not found.");
      setLoading(false);
      return;
    }

    setList(listData);

    // Fetch the list items
    const { data: itemData, error: itemError } = await supabase
      .from("list_items")
      .select("id, content, is_checked")
      .eq("list_id", listData.id)
      .order("created_at", { ascending: true });

    if (itemError) {
      setError(itemError.message);
    } else {
      setItems(itemData || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchSharedList();
  }, [token]);

  if (loading) return <p className="p-4">Loading shared list...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!list) return null;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Link to="/" className="text-blue-500 hover:underline text-sm">
        &larr; Back to Home
      </Link>
      <h1 className="text-2xl font-bold mb-4 mt-2">{list.name}</h1>

      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center border p-3 rounded">
              <span
                className={`flex-1 ${
                  item.is_checked ? "line-through text-gray-400" : ""
                }`}
              >
                {item.content}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

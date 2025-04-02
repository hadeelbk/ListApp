import { useParams, Link, useNavigate } from "react-router-dom";
import { useListItems } from "../features/lists/useListItems";
import { useState, useEffect } from "react";
import { useAuth } from "../features/auth/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { ListItem } from "../components/ListItem";
import { Navbar } from "../components/NavBar";

export default function ListDetails() {
  const { id: listId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newItem, setNewItem] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  const { items, loading, addItem, deleteItem, toggleCheck } = useListItems(
    listId || null
  );

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  const handleAdd = async () => {
    if (!newItem.trim()) return;
    await addItem(newItem);
    setNewItem("");
  };

  const handleInvite = async () => {
    setInviteError(null);
    setInviteSuccess(null);

    if (!inviteEmail.trim()) return;

    const { data: users, error: lookupError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("email", inviteEmail.trim().toLowerCase())
      .limit(1);

    if (lookupError || !users || users.length === 0) {
      setInviteError("User not found. Make sure they’ve signed up.");
      return;
    }

    const userIdToInvite = users[0].id;
    
// Prevent users from inviting themselves as collaborators
    if (userIdToInvite === user?.id) {
      setInviteError("You cannot invite yourself.");
      return;
    }

    const { error: insertError } = await supabase
      .from("list_collaborators")
      .insert([{ list_id: listId, user_id: userIdToInvite }]);

    if (insertError) {
      if (insertError.code === "23505") {
        setInviteError("User is already a collaborator.");
      } else {
        setInviteError(insertError.message);
      }
      return;
    }

    setInviteSuccess("Collaborator added!");
    setInviteEmail("");
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <Navbar />
      <Link to="/dashboard" className="text-blue-500 hover:underline text-sm">
        &larr; Back to Lists
      </Link>
      <h1 className="text-2xl font-bold mb-4 mt-2">Your List</h1>

      {/* Add Item */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Invite Collaborator */}
      <div className="my-4">
        <h2 className="text-lg font-semibold mb-2">Invite a roommate:</h2>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Roommate's email"
            className="border p-2 flex-1 rounded"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <button
            onClick={handleInvite}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Invite
          </button>
        </div>
        {inviteSuccess && (
          <p className="text-green-600 mt-2">{inviteSuccess}</p>
        )}
        {inviteError && <p className="text-red-500 mt-2">{inviteError}</p>}
      </div>

      {/* List Items */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <ListItem
              key={item.id}
              id={item.id}
              content={item.content}
              isChecked={item.is_checked}
              onToggle={toggleCheck}
              onDelete={deleteItem}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

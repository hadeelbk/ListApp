import { useAuth } from "../features/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLists } from "../features/lists/useLists";
import { ListCard } from "../components/ListCard";
import { Navbar } from "../components/NavBar";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState<"private" | "shared">("private");

  const { lists, addList, deleteList, loading, fetchLists } = useLists(
    user?.id || null
  );

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  const handleAdd = async () => {
    if (!name.trim()) return;
    await addList(name, visibility);
    setName("");
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      console.warn("Tried to delete a list with no ID.");
      return;
    }
    await deleteList(id);
  };

  const handleUseTemplate = async (templateId: string) => {
    const newName = prompt("What do you want to name the new list?");
    if (!newName || !user?.id) return;

    try {
      const response = await fetch(
        "http://localhost:4000/api/templates/clone",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            templateId,
            newName,
            userId: user.id,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("List created from template!");
        fetchLists();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while cloning the template.");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <Navbar />

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Welcome, <span className="text-blue-600">{user?.email}</span>
      </h1>

      {/* Create List Form */}
      <div className="bg-white border p-4 rounded-xl shadow-sm mb-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-700">
          Create a New List
        </h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="List name"
            className="border p-2 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            value={visibility}
            onChange={(e) =>
              setVisibility(e.target.value as "private" | "shared")
            }
            className="border p-2 rounded w-full sm:w-40"
          >
            <option value="private">Private</option>
            <option value="shared">Shared</option>
          </select>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Lists */}
      {loading ? (
        <p className="text-gray-500 text-center">Loading your lists...</p>
      ) : (
        <ul className="space-y-3">
          {lists.map((list) => (
            <ListCard
              key={list.id}
              id={list.id}
              name={list.name}
              visibility={list.visibility}
              shareToken={list.share_token}
              onDelete={handleDelete}
              onUseTemplate={handleUseTemplate} // pass the new handler
              isSharedWithUser={list.user_id !== user?.id}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

import { useAuth } from "../features/auth/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="w-full bg-gray-100 shadow-sm py-4 px-6 flex justify-between items-center mb-6">
      <Link to="/dashboard" className="text-lg font-bold text-blue-600">
        ListApp
      </Link>

      {user && (
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      )}
    </nav>
  );
}

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/LogIn";
import Dashboard from "../pages/Dashboard";
import ListDetails from "../pages/ListDetails";
import SharedListView from "../pages/SharedListView";
import { User } from "@supabase/supabase-js";

export default function AppRoutes({ user }: { user: User | null }) {
  return (
    <Routes>
  <Route path="/" element={user ? <Dashboard /> : <Login />} />
  <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
  <Route path="/list/:id" element={<ListDetails />} />
  <Route path="/shared/:token" element={<SharedListView />} />
  <Route path="*" element={<Navigate to="/" />} />
</Routes>
  );
}

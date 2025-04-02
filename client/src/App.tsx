import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./features/auth/AuthProvider";

import "./App.css";

export default function App() {
  const { user } = useAuth();

  // Optional: show a loading state while auth is initializing
  if (user === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <AppRoutes user={user} />
    </BrowserRouter>
  );
}

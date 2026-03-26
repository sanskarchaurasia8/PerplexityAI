import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import { useAuth } from "../features/auth/hook/useAuth";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const { handleGetMe, handleLogout } = useAuth();
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    if (user) {
      handleGetMe().catch(() => handleLogout());
    }
  }, []);

  return <RouterProvider router={router} />;
}

export default App

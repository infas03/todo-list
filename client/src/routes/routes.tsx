import { Routes, Route, Navigate } from "react-router-dom";

import { ROLES } from "../constants/role";
import { useAuth } from "../context/AuthProvider";
import { ProtectedRoute } from "./protectedRoute";
import Admin from "../pages/adminPage";
import User from "../pages/userPage";
import Login from "../pages/loginPage";
import AdminUsersPage from "../pages/adminUsersPage";

const AppRoutes = () => {
  const { isLoggedIn, role, resolved } = useAuth();

  if (!resolved) {
    return null;
  }

  return (
    <Routes>
      <Route
        element={
          isLoggedIn ? role === ROLES.ADMIN ? <Admin /> : <User /> : <Login />
        }
        path="/"
      />

      <Route
        element={
          <ProtectedRoute
            isAllowed={isLoggedIn && role === ROLES.ADMIN}
            redirectPath="/"
          >
            <AdminUsersPage />
          </ProtectedRoute>
        }
        path="/users"
      />

      <Route element={<Navigate to="/" />} path="*" />
    </Routes>
  );
};

export default AppRoutes;

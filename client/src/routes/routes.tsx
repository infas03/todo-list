import { Routes, Route, Navigate } from "react-router-dom";

import { ROLES } from "../constants/role";
import { useAuth } from "../context/AuthProvider";
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
          isLoggedIn ? (
            role === ROLES.ADMIN ? (
              <AdminUsersPage />
            ) : (
              <User />
            )
          ) : (
            <Login />
          )
        }
        path="/"
      />

      <Route element={<Navigate to="/" />} path="*" />
    </Routes>
  );
};

export default AppRoutes;

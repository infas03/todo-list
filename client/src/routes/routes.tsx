import { Routes, Route, Navigate } from "react-router-dom";

import { ROLES } from "../constants/role";
import { useAuth } from "../context/AuthProvider";
import { ProtectedRoute } from "./protectedRoute";

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
            <Employees />
          </ProtectedRoute>
        }
        path="/employees"
      />

      <Route element={<Navigate to="/" />} path="*" />
    </Routes>
  );
};

export default AppRoutes;

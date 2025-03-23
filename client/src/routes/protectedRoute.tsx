import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({
  isAllowed,
  redirectPath = "/",
  children,
}: {
  isAllowed: boolean;
  redirectPath?: string;
  children: React.ReactNode;
}) => {
  if (!isAllowed) {
    return <Navigate replace to={redirectPath} />;
  }

  return <>{children}</>;
};

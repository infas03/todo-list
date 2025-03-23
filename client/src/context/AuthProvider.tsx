import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Role } from "../constants/role";
import { User } from "../types";
import { useSelector } from "react-redux";
import { selectUserDetails } from "../redux/slices/userSlice";

type AuthContextType = {
  isLoggedIn: boolean;
  role: string | null;
  token: string | null;
  userDetails: User | null;
  resolved: boolean;
  login: (newToken: string, newRole: Role, userDetails: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const userDetailsState = useSelector(selectUserDetails);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken && userDetailsState) {
      setIsLoggedIn(true);
      setToken(storedToken);
      setRole(userDetailsState.role);
      setUserDetails(userDetailsState ? userDetailsState : null);
    }

    setResolved(true);
  }, []);

  const login = (newToken: string, newRole: Role, newUserDetails: User) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setRole(newRole);
    setUserDetails(newUserDetails);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRole(null);
    setUserDetails(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, token, userDetails, role, resolved, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

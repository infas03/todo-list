import ToastBar from "../../components/toastBar";
import api from "../../services/api";
import { LoginInput } from "../types";
import { Role } from "../..//constants/role";
import { User } from "../../types/index";

interface ApiError {
  response?: {
    status: number;
    data: {
      errorMsg: string | string[];
      status: number;
    };
  };
  message: string;
}

export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

export const loginUserSuccess = (data: any) => ({
  type: FETCH_USER_SUCCESS,
  payload: data,
});

export const logoutUserSuccess = () => ({
  type: LOGOUT_SUCCESS,
});

export const userLogin = (
  values: LoginInput,
  navigate: (path: string) => void,
  login: (token: string, role: Role, userDetails: User) => void
) => {
  return async (): Promise<void> => {
    try {
      const response = await api.post("/auth/login", values);

      if (response.data.success) {
        console.log("response: ", response.data);

        ToastBar.success("Login successful");
        localStorage.setItem("token", response.data.token);
        login(
          response.data.data.token,
          response.data.data.user.role,
          response.data.data.user,
        );
        navigate("/users");
      }
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.response && apiError.response.status === 500) {
        const errorMsg = Array.isArray(apiError.response.data.errorMsg)
          ? apiError.response.data.errorMsg.join(", ")
          : apiError.response.data.errorMsg;

        ToastBar.error(errorMsg);
      } else {
        ToastBar.error(apiError.message);
      }
    }
  };
};

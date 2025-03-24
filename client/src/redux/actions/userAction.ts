import { AnyAction, ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";

import ToastBar from "../../components/toastbar";
import api from "../../services/api";

import { Role } from "@/constants/role";
import { User } from "@/types";
import { LoginInput } from "../types";

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

export const userLogin = (
  values: LoginInput,
  navigate: (path: string) => void,
  login: (token: string, role: Role, userDetails: User) => void,
) => {
  return async (): Promise<void> => {
    const inputData = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await api.post("/v1/auth/login", inputData);

      if (response.status === 200) {
        ToastBar.success("Login successful");
        localStorage.setItem("token", response.data.token);
        login(response.data.token, response.data.role, response.data.user);
        navigate("/search-jobs");
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

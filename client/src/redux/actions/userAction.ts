import ToastBar from "../../components/toastBar";
import api from "../../services/api";
import { LoginInput, UserInput, UserTaskInput } from "../types";
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
export const FETCH_ALL_USER_SUCCESS = "FETCH_ALL_USER_SUCCESS";

export const loginUserSuccess = (data: any) => ({
  type: FETCH_USER_SUCCESS,
  payload: data,
});

export const logoutUserSuccess = () => ({
  type: LOGOUT_SUCCESS,
});

export const fetchAllUsers = (data: any) => ({
  type: FETCH_ALL_USER_SUCCESS,
  payload: data,
});

export const userLogin = (
  values: LoginInput,
  navigate: (path: string) => void,
  login: (token: string, role: Role, userDetails: User) => void,
  setError: (error: string) => void,
  setIsLoading: (loading: boolean) => void,
) => {
  return async (): Promise<void> => {
    try {
      const response = await api.post("/auth/login", values);

      if (response.data.success) {
        ToastBar.success("Login successful");
        localStorage.setItem("token", response.data.token);
        login(
          response.data.data.token,
          response.data.data.user.role,
          response.data.data.user,
        );
        navigate("/");
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      setError(error.response.data.message);
      ToastBar.error(error.response.data.message);
    }
  };
};

export const userRegister = (values: UserInput, onClose: () => void) => {
  return async (dispatch: any): Promise<void> => {
    try {
      const response = await api.post("/auth/register", values);

      if (response.data.success) {
        ToastBar.success("Register successful");
        dispatch(getAllUsers());
        onClose();
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

export const getAllUsers = () => {
  return async (dispatch: any): Promise<void> => {
    try {
      const response = await api.get("/auth/users");

      if (response.data.success) {
        dispatch(fetchAllUsers(response.data.data));
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

export const userUpdate = (values: UserTaskInput, onClose: () => void) => {
  return async (dispatch: any): Promise<void> => {
    try {
      const response = await api.patch(`/auth/users/${values?._id}`, values);

      if (response.data.success) {
        ToastBar.success(response.data.message);
        dispatch(getAllUsers());
        onClose();
      }
    } catch (error: any) {
      ToastBar.error(error.response.data.message);
    }
  };
};

export const userDelete = (userId: string) => {
  return async (dispatch: any): Promise<void> => {
    try {
      const response = await api.delete(`/auth/users/${userId}`);

      if (response.data.success) {
        ToastBar.success(response.data.message);
        dispatch(getAllUsers());
      }
    } catch (error: any) {
      ToastBar.error(error.response.data.message);
    }
  };
};

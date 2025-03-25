import ToastBar from "../../components/toastBar";
import api from "../../services/api";
import { TaskInput } from "../types";

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

export const FETCH_TASKS = "FETCH_TASKS";

export const fetchTasksSuccess = (data: any) => ({
  type: FETCH_TASKS,
  payload: data,
});

export const getAllTasks = (queryParams: string) => {
  return async (dispatch: any): Promise<void> => {
    try {
      const response = await api.get(`/tasks?${queryParams}`);

      if (response.data.success) {
        console.log("response: ", response.data);
        dispatch(fetchTasksSuccess(response.data.data));
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

export const createTask = (values: TaskInput, onClose: () => void) => {
  return async (): Promise<void> => {
    try {
      const response = await api.post("/tasks", values);

      if (response.data.success) {
        console.log("response: ", response.data);
        ToastBar.success(response.data.message);
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

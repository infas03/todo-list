import ToastBar from "../../components/toastBar";
import api from "../../services/api";
import { TaskInput, UpdateTaskInput } from "../types";

interface ApiError {
  response?: {
    status: number;
    data: {
      errorMsg: string | string[];
      status: number;
      message: string | string[];
    };
  };
  message: string;
}

export const FETCH_TASKS = "FETCH_TASKS";

export const fetchTasksSuccess = (data: any) => ({
  type: FETCH_TASKS,
  payload: data,
});

export const getAllTasks = (
  queryParams?: string,
  setIsLoading?: (loading: boolean) => void
) => {
  return async (dispatch: any): Promise<void> => {
    try {
      const response = await api.get(`/tasks?${queryParams}`);

      if (response.data.success) {
        dispatch(fetchTasksSuccess(response.data.data));
        setIsLoading && setIsLoading(false);
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
      setIsLoading && setIsLoading(false);
    }
  };
};

export const createTask = (
  values: TaskInput,
  onClose: () => void,
  setIsLoading: (loading: boolean) => void
) => {
  return async (dispatch: any): Promise<void> => {
    try {
      const response = await api.post("/tasks", values);

      if (response.data.success) {
        dispatch(getAllTasks());
        ToastBar.success(response.data.message);
        onClose();
        setIsLoading(false);
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("error: ", error);
      ToastBar.warning(error.response.data.message);
      setIsLoading(false);
    }
  };
};

export const updateTask = (
  values: UpdateTaskInput,
  setIsLoading: (loading: boolean) => void,
  taskId: string,
  setIsLoadingStatus: (taskId: string, loading: boolean) => void,
  setIsLoadingDepend: (taskId: string, loading: boolean) => void,
  onClose?: () => void
) => {
  return async (dispatch: any): Promise<void> => {
    try {
      const response = await api.patch(`/tasks/${values.id}`, values);

      if (response.data.success) {
        dispatch(getAllTasks());
        ToastBar.success(response.data.message);
        onClose && onClose();
        setIsLoading && setIsLoading(false);
        setIsLoadingStatus && taskId && setIsLoadingStatus(taskId, false);
        setIsLoadingDepend && taskId && setIsLoadingDepend(taskId, false);
      }
    } catch (error: any) {
      setIsLoading && setIsLoading(false);
      setIsLoadingStatus && taskId && setIsLoadingStatus(taskId, false);
      setIsLoadingDepend && taskId && setIsLoadingDepend(taskId, false);
      console.log(error);
      ToastBar.warning(error.response.data.message);
    }
  };
};

export const deleteTask = (
  taskId: string,
  fetchTask: () => void,
  setIsLoadingDelete: (taskId: string, loading: boolean) => void
) => {
  return async (): Promise<void> => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);

      if (response.data.success) {
        fetchTask();
        ToastBar.success(response.data.message);
        setIsLoadingDelete && taskId && setIsLoadingDelete(taskId, false);
      }
    } catch (error: any) {
      ToastBar.warning(error.response.data.message);
      setIsLoadingDelete && taskId && setIsLoadingDelete(taskId, false);
    }
  };
};

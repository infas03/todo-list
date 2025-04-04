import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { useEffect, useState } from "react";
import {
  Alert,
  Checkbox,
  Chip,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import { useAuth } from "../context/AuthProvider";
import { taskFilter, userTaskTableColumns } from "../config/staticValue";
import { Task } from "../types";
import { RootState } from "../redux/store";
import {
  deleteTask,
  getAllTasks,
  updateTask,
} from "../redux/actions/taskAction";

import { EmployerTableSkeleton } from "./skeleton/employerTableSkeleton";
import { FilterSwitch } from "./filterSwitch";
import { TaskForm } from "./taskForm";
import { DeleteConfirmationForm } from "./deleteConfirmationModal";
import { AddDependenciesButton } from "./addDependenciesButton";

export const UserTaskTable = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

  const task = useSelector((state: RootState) => state.task);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState<
    Record<string, boolean>
  >({});
  const [isLoadingDepend, setIsLoadingDepend] = useState<
    Record<string, boolean>
  >({});
  const [mainFilter, setMainFilter] = useState<string | undefined>("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const { userDetails } = useAuth();

  const fetchTasks = async () => {
    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams();

      if (mainFilter) queryParams.append("mainFilter", mainFilter);
      if (sortOrder) queryParams.append("sortOrder", sortOrder);
      if (searchTerm) queryParams.append("search", searchTerm);

      if (!userDetails) {
        throw new Error("User details are not available");
      }

      dispatch(getAllTasks(queryParams.toString(), setIsLoading));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching tasks:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [userDetails?._id, mainFilter, sortOrder]);

  const handleSortChange = (key: string) => {
    setMainFilter(key);
    setSortOrder("asc");
  };

  const handleFilterSwitch = (value: boolean) => {
    if (value) {
      setSortOrder("desc");
    } else {
      setSortOrder("asc");
    }
  };

  const handleCheckboxChange = async (
    taskId: string,
    currentStatus: string,
  ) => {
    try {
      setIsLoadingStatus((prevState) => ({
        ...prevState,
        [taskId]: true,
      }));

      const updatedStatus = currentStatus === "done" ? "not_done" : "done";

      const updateData = {
        id: taskId,
        status: updatedStatus,
      };

      const success = await dispatch(
        updateTask(
          updateData,
          setIsLoading,
          taskId,
          (id, loading) =>
            setIsLoadingStatus((prev) => ({ ...prev, [id]: loading })),
          (id, loading) =>
            setIsLoadingDepend((prev) => ({ ...prev, [id]: loading })),
        ),
      );

      if (success) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        await dispatch(getAllTasks());
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("error" + error);

      setIsLoadingStatus((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId: string): Promise<boolean> => {
    try {
      await dispatch(deleteTask(taskId));

      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("error: ", error);

      return false;
    }
  };

  const handleDependenciesSelected = (
    taskId: string,
    selectedIds: string[],
  ) => {
    setIsLoadingDepend((prevState) => ({
      ...prevState,
      [taskId]: true,
    }));

    dispatch(
      updateTask(
        { id: taskId, dependencies: selectedIds },
        setIsLoading,
        taskId,
        (taskId: string, loading: boolean) =>
          setIsLoadingStatus((prevState) => ({
            ...prevState,
            [taskId]: loading,
          })),
        (taskId: string, loading: boolean) =>
          setIsLoadingDepend((prevState) => ({
            ...prevState,
            [taskId]: loading,
          })),
      ),
    );
  };

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("isLoadingDepend: ", isLoadingDepend);
  }, []);
  useEffect(() => {
    console.log("isLoadingStatus changed:", isLoadingStatus);
  }, [isLoadingStatus]);

  return (
    <div className="p-4 w-full" data-testid="task-table-container">
      <div
        className="flex justify-end items-center mb-4 text-sm"
        data-testid="task-table-controls"
      >
        <div className="flex items-center gap-x-2">
          <Input
            className="w-48"
            data-testid="search-input"
            name="search"
            placeholder="Search Task"
            type="text"
            value={searchTerm}
            variant="bordered"
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
          />
          <TaskForm data-testid="create-task-button" mode="create" />
          <span>Sort By:</span>
          <Select
            aria-label="Sort tasks by"
            className="w-32"
            data-testid="sort-select"
            defaultSelectedKeys={["dueDate"]}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];

              handleSortChange(selectedKey as string);
            }}
          >
            {taskFilter.map((filter) => (
              <SelectItem key={filter.key}>{filter.label}</SelectItem>
            ))}
          </Select>
          <FilterSwitch
            data-testid="sort-order-switch"
            isSelected={sortOrder === "desc" ? true : false}
            onValueChange={handleFilterSwitch}
          />
        </div>
      </div>
      <div className="flex flex-col items-center">
        {isLoading ? (
          <div className="w-full" data-testid="loading-skeleton">
            <EmployerTableSkeleton />
          </div>
        ) : (
          <>
            <Table
              aria-label="Example table with dynamic content"
              className="max-w-6xl"
              data-testid="tasks-table"
            >
              <TableHeader columns={userTaskTableColumns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={task.tasks}>
                {(item: Task) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>
                        {columnKey === "priority" && (
                          <Chip
                            className="capitalize"
                            color={
                              item?.priority === "low"
                                ? "default"
                                : item?.priority === "medium"
                                  ? "warning"
                                  : item?.priority === "high"
                                    ? "danger"
                                    : "primary"
                            }
                          >
                            {item?.priority}
                          </Chip>
                        )}
                        {columnKey === "name" && (
                          <div className="max-w-[450px]">
                            <div className="text-sm">{item?.title}</div>
                            <div className="text-xs">{item?.description}</div>
                          </div>
                        )}
                        {columnKey === "dueDate" && (
                          <Alert
                            className={`border-transparent text-xs w-52 ${
                              new Date(item?.dueDate) < new Date()
                                ? "text-red-500"
                                : new Date(item?.dueDate).toDateString() ===
                                    new Date().toDateString()
                                  ? "text-black"
                                  : "text-blue-500"
                            } bg-transparent`}
                            color="default"
                            hideIcon={new Date(item?.dueDate) >= new Date()}
                            title={new Date(item?.dueDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                            variant="bordered"
                          />
                        )}
                        {columnKey === "status" && (
                          <div className="w-44">
                            {Boolean(isLoadingStatus[item.id]) ? (
                              <Spinner color="primary" />
                            ) : (
                              <Checkbox
                                color="success"
                                disabled={isLoadingStatus[item.id]}
                                isSelected={item?.status === "done"}
                                onChange={() => {
                                  if (item.id !== undefined) {
                                    handleCheckboxChange(item.id, item?.status);
                                  }
                                }}
                              >
                                {item?.status === "done"
                                  ? "Completed"
                                  : "Mark as completed"}
                              </Checkbox>
                            )}
                          </div>
                        )}
                        {columnKey === "action" && (
                          <div className="flex items-center gap-x-2">
                            <AddDependenciesButton
                              allTasks={task.tasks}
                              currentDependencies={item.dependencies}
                              currentTaskId={item.id}
                              onDependenciesSelected={(selectedIds) =>
                                handleDependenciesSelected(item.id, selectedIds)
                              }
                            />
                            <TaskForm mode="edit" task={item} />
                            <div>
                              <DeleteConfirmationForm
                                entityName="task"
                                id={item.id!}
                                onConfirm={handleDeleteTask}
                              />
                            </div>
                          </div>
                        )}
                        {columnKey !== "name" &&
                          columnKey !== "status" &&
                          columnKey !== "dueDate" &&
                          columnKey !== "priority" &&
                          columnKey !== "action" &&
                          getKeyValue(item, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </div>
  );
};

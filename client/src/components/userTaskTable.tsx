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
import { Alert, Checkbox, Chip, Select, SelectItem } from "@heroui/react";

import { FilterSwitch } from "./filterSwitch";

import { EmployerTableSkeleton } from "./skeleton/employerTableSkeleton";
import { Task } from "../types";
import { useAuth } from "../context/AuthProvider";
import api from "../services/api";
import { taskFilter, userTaskTableColumns } from "../config/staticValue";

export const UserTaskTable = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [finishedTasks, setFinishedTasks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [mainFilter, setMainFilter] = useState<string | undefined>("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { userDetails } = useAuth();

  const fetchTasks = async () => {
    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams();

      if (mainFilter) queryParams.append("mainFilter", mainFilter);
      if (sortOrder) queryParams.append("sortOrder", sortOrder);

      if (!userDetails) {
        throw new Error("User details are not available");
      }

      const response = await api.get(
        `/v1/tasks/${userDetails.id}?${queryParams.toString()}`
      );

      if (response?.data.success) {
        setTasks(response.data.data.tasks);
        setTotalTasks(response.data.data.totalTasks);
        setFinishedTasks(response.data.data.finishedTasks);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [userDetails?.id, mainFilter, sortOrder]);

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
    taskId: number,
    currentStatus: boolean
  ) => {
    try {
      const updatedStatus = !currentStatus;

      const response = await api.put(`/v1/tasks/${taskId}`, {
        isCompleted: updatedStatus,
      });

      if (response.data.success) {
        fetchTasks();
      } else {
        // eslint-disable-next-line no-console
        console.error("Login failed. Please try again.");
      }
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.error("Invalid credentials.");
      } else {
        // eslint-disable-next-line no-console
        console.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-4 text-sm">
        <h1 className="">
          {totalTasks} active tasks, {finishedTasks} completed
        </h1>
        <div className="flex items-center gap-x-2">
          <span>Sort By:</span>
          <Select
            aria-label="Sort tasks by"
            className="w-32"
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
            isSelected={sortOrder === "desc" ? true : false}
            onValueChange={handleFilterSwitch}
          />
        </div>
      </div>
      <div className="flex flex-col items-center">
        {isLoading ? (
          <div className="w-full">
            <EmployerTableSkeleton />
          </div>
        ) : (
          <>
            <Table
              aria-label="Example table with dynamic content"
              className="max-w-5xl"
            >
              <TableHeader columns={userTaskTableColumns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={tasks}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>
                        {columnKey === "priority" && (
                          <Chip
                            color={
                              item?.priority === "Low"
                                ? "default"
                                : item?.priority === "Medium"
                                  ? "warning"
                                  : item?.priority === "High"
                                    ? "danger"
                                    : "primary"
                            }
                          >
                            {item?.priority}
                          </Chip>
                        )}
                        {columnKey === "name" && (
                          <div className="max-w-[450px]">
                            <div className="text-sm">{item?.name}</div>
                            <div className="text-xs">{item?.description}</div>
                          </div>
                        )}
                        {columnKey === "dueDate" && (
                          <Alert
                            className={`border-transparent text-xs ${
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
                              }
                            )}
                            variant="bordered"
                          />
                        )}
                        {columnKey === "status" && (
                          <div className="">
                            <Checkbox
                              color="success"
                              defaultSelected={item?.isCompleted}
                              onChange={() => {
                                if (item.id !== undefined) {
                                  handleCheckboxChange(
                                    item.id,
                                    item?.isCompleted
                                  );
                                }
                              }}
                            >
                              {item?.isCompleted
                                ? "Completed"
                                : "Mark as completed"}
                            </Checkbox>
                          </div>
                        )}
                        {columnKey !== "name" &&
                          columnKey !== "status" &&
                          columnKey !== "dueDate" &&
                          columnKey !== "priority" &&
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

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
  Form,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import { priorities, recurrenceOptions } from "../config/staticValue";
import { AssignFormData, Task } from "../types";
import { createTask, updateTask } from "../redux/actions/taskAction";
import { RootState } from "../redux/store";

interface TaskFormProps {
  mode?: "create" | "edit";
  task?: Task;
}

export const TaskForm = ({ mode = "create", task }: TaskFormProps) => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AssignFormData>>({
    id: "",
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    recurrence: {
      startDate: "",
      pattern: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState<
    Record<string, boolean>
  >({});
  const [isLoadingDepend, setIsLoadingDepend] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    console.log("check: ", isLoadingDepend, isLoadingStatus);
  }, []);

  useEffect(() => {
    if (mode === "edit" && task) {
      setFormData({
        id: task?.id,
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        dueDate: task.dueDate?.split("T")[0] || "",
        recurrence: {
          pattern: task?.recurrence?.pattern || "",
          startDate: task?.recurrence?.startDate || "",
        },
      });
    }
  }, [mode, task]);

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    onClose: () => void
  ) => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    const data = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as unknown as AssignFormData;

    const addData = {
      ...data,
      recurrence: {
        pattern: data.recurrence,
        startDate: data.dueDate,
      },
    };

    const updateData = {
      ...data,
      id: task?.id,
      recurrence: {
        pattern: data.recurrence,
        startDate: data.dueDate,
      },
    };

    try {
      if (mode === "edit" && task) {
        await dispatch(
          updateTask(
            updateData,
            setIsLoading,
            formData.id || "",
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
            onClose
          )
        );
      } else {
        await dispatch(createTask(addData, onClose, setIsLoading));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      setError(errorMessage);
      setIsLoading(false);
      // eslint-disable-next-line no-console
      console.error(
        `${mode === "edit" ? "Updating" : "Creating"} task failed:`,
        errorMessage
      );
    }
  };

  return (
    <>
      <Button
        color={mode === "create" ? "primary" : "secondary"}
        onPress={onOpen}
      >
        {mode === "edit" ? "Edit" : "Add Task"}
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <Form className="w-full" onSubmit={(e) => onSubmit(e, onOpenChange)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {mode === "edit" ? "Edit Task" : "Assign Task"}
                </ModalHeader>
                <ModalBody>
                  <Input
                    isRequired
                    defaultValue={formData.title}
                    errorMessage="Please enter a valid task title"
                    label="Task Title"
                    name="title"
                    placeholder="Enter task title"
                    type="text"
                    variant="bordered"
                  />
                  <Textarea
                    isRequired
                    defaultValue={formData.description}
                    errorMessage="Please enter a valid task description"
                    label="Task Description"
                    name="description"
                    placeholder="Enter task description"
                    variant="bordered"
                  />
                  <Select
                    isRequired
                    className="w-full"
                    defaultSelectedKeys={[formData.priority || "medium"]}
                    items={priorities}
                    label="Priority"
                    name="priority"
                    placeholder="Select priority"
                    variant="bordered"
                  >
                    {(item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    )}
                  </Select>
                  <Input
                    isRequired
                    defaultValue={formData.dueDate}
                    errorMessage="Please enter a valid due date"
                    label="Due Date"
                    name="dueDate"
                    placeholder="Select due date"
                    type="date"
                    variant="bordered"
                  />
                  <Select
                    isRequired
                    className="w-full"
                    defaultSelectedKeys={[
                      formData.recurrence?.pattern || "none",
                    ]}
                    items={recurrenceOptions}
                    label="Recurrence"
                    name="recurrence"
                    placeholder="Select recurrence"
                    variant="bordered"
                  >
                    {(item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    )}
                  </Select>
                  {error && <p className="text-red-500">{error}</p>}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    type="button"
                    variant="flat"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    disabled={isLoading}
                    isLoading={isLoading}
                    type="submit"
                  >
                    {isLoading
                      ? ""
                      : mode === "edit"
                        ? "Update Task"
                        : "Assign Task"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </Modal>
    </>
  );
};

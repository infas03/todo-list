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
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import { priorities } from "@/config/staticValue";
import { AssignFormData } from "@/types";
import { createTask } from "@/redux/actions/taskAction";
import { RootState } from "@/redux/store";

export const AssignTaskForm = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    onClose: () => void
  ) => {
    setError(null);
    e.preventDefault();

    const data = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as unknown as AssignFormData;

    console.log("taskData: ", data);

    try {
      dispatch(createTask(data, onClose));
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.error("Error assigning task:", error.message);
        setError("Error assigning task, try again later!");
      } else {
        // eslint-disable-next-line no-console
        console.error("Error assigning task");
        setError("Error assigning task, try again later!");
      }
    }
  };

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Add Task
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <Form className="w-full" onSubmit={(e) => onSubmit(e, onOpenChange)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Assign Task
                </ModalHeader>
                <ModalBody>
                  <Input
                    isRequired
                    errorMessage="Please enter a valid task title"
                    label="Task Title"
                    name="title"
                    placeholder="Enter task title"
                    type="text"
                    variant="bordered"
                  />
                  <Textarea
                    isRequired
                    errorMessage="Please enter a valid task description"
                    label="Task Description"
                    name="description"
                    placeholder="Enter task description"
                    variant="bordered"
                  />
                  <Select
                    isRequired
                    className="w-full"
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
                    errorMessage="Please enter a valid due date"
                    label="Due Date"
                    name="dueDate"
                    placeholder="Select due date"
                    type="date"
                    variant="bordered"
                  />
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
                  <Button color="primary" type="submit">
                    Assign Task
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

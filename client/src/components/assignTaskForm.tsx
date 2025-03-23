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
} from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { useState } from "react";

import { NotepadIcon } from "./icons";

import api from "@/services/api";
import { priorities } from "@/config/staticValue";
import { AssignFormData } from "@/types";

interface AssignTaskFormProps {
  employeeId: number;
}

export const AssignTaskForm = ({ employeeId }: AssignTaskFormProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    onClose: () => void,
  ) => {
    setError(null);
    e.preventDefault();

    const data = Object.fromEntries(
      new FormData(e.currentTarget),
    ) as unknown as AssignFormData;

    const taskData = {
      ...data,
      employeeId,
    };

    console.log("taskData: ", taskData);

    try {
      const response = await api.post("/v1/tasks", taskData);

      if (response.data.success) {
        onClose();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error assigning task:", error.message);
        setError("Error assigning task, try again later!");
      } else {
        console.error("Error assigning task");
        setError("Error assigning task, try again later!");
      }
    }
  };

  return (
    <>
      <button className="text-blue-500 hover:text-blue-700" onClick={onOpen}>
        <NotepadIcon />
      </button>
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
                    errorMessage="Please enter a valid task name"
                    label="Task Name"
                    name="name"
                    placeholder="Enter task name"
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
                  <Autocomplete
                    isRequired
                    className="w-full"
                    defaultItems={priorities}
                    label="Priority"
                    name="priority"
                    placeholder="Select priority"
                    variant="bordered"
                  >
                    {(item) => (
                      <AutocompleteItem key={item.key}>
                        {item.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
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

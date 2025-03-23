import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Form,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";

import { EditIcon, EyeFilledIcon, EyeSlashFilledIcon } from "./icons";

import { departments } from "@/config/staticValue";
import { EmployeeFormData } from "@/types";
import api from "@/services/api";

interface EmployeesAddFormProps {
  onEmployeeCreated: () => void;
  mode?: "add" | "update";
  employeeId?: number;
  initialData?: EmployeeFormData;
}

export const EmployeesAddForm = ({
  onEmployeeCreated,
  mode = "add",
  employeeId,
  initialData,
}: EmployeesAddFormProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    onClose: () => void,
  ) => {
    setError(null);
    e.preventDefault();

    const data = Object.fromEntries(
      new FormData(e.currentTarget),
    ) as unknown as EmployeeFormData;

    console.log("Form Data:", data);

    try {
      let response;

      if (mode === "add") {
        response = await api.post("/v1/employees", data);
      } else if (mode === "update" && employeeId) {
        response = await api.put(`/v1/employees/${employeeId}`, data);
      }

      if (response?.data.success) {
        onClose();
        onEmployeeCreated();
      }
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.error("Error:", error.message);
        setError(
          `Error ${mode === "add" ? "creating" : "updating"} employee, try again later!`
        );
      } else {
        // eslint-disable-next-line no-console
        console.error("Error");
        setError(
          `Error ${mode === "add" ? "creating" : "updating"} employee, try again later!`
        );
      }
    }
  };

  return (
    <>
      {mode === "add" ? (
        <Button color="primary" onPress={onOpen}>
          Add Employee
        </Button>
      ) : (
        <button
          className="text-green-500 hover:text-green-700"
          onClick={onOpen}
        >
          <EditIcon />
        </button>
      )}
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <Form className="w-full" onSubmit={(e) => onSubmit(e, onOpenChange)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {mode === "add" ? "Add Employee" : "Update Employee"}
                </ModalHeader>
                <ModalBody>
                  <Input
                    isRequired
                    defaultValue={initialData?.firstName}
                    errorMessage="Please enter a valid first name"
                    label="First Name"
                    name="firstName"
                    placeholder="Enter first name"
                    type="text"
                    variant="bordered"
                  />
                  <Input
                    isRequired
                    defaultValue={initialData?.lastName}
                    errorMessage="Please enter a valid last name"
                    label="Last Name"
                    name="lastName"
                    placeholder="Enter last name"
                    type="text"
                    variant="bordered"
                  />
                  <Input
                    isRequired
                    defaultValue={initialData?.username}
                    errorMessage="Please enter a valid username"
                    label="Username"
                    name="username"
                    placeholder="Enter username"
                    type="text"
                    variant="bordered"
                  />
                  <Input
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isPasswordVisible ? (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    errorMessage="Please enter a valid password"
                    isRequired={mode === "add"}
                    label="Password"
                    name="password"
                    placeholder="Enter your password"
                    type={isPasswordVisible ? "text" : "password"}
                    variant="bordered"
                  />
                  <Select
                    isRequired
                    className="w-full"
                    defaultSelectedKeys={
                      initialData?.department ? [initialData.department] : []
                    }
                    items={departments}
                    label="Department"
                    name="department"
                    placeholder="Select department"
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
                  <Button color="primary" type="submit">
                    {mode === "add" ? "Add Employee" : "Update Employee"}
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

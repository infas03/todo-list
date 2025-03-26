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
} from "@heroui/react";
import { useState } from "react";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useDispatch } from "react-redux";

import { EditIcon, EyeFilledIcon, EyeSlashFilledIcon, UserIcon } from "./icons";

import { AddUserFormData } from "@/types";
import { RootState } from "@/redux/store";
import { userRegister, userUpdate } from "@/redux/actions/userAction";

interface UserAddFormProps {
  mode?: "add" | "update";
  userId?: string;
  initialData?: AddUserFormData;
}

export const UserAddForm = ({
  mode = "add",
  userId,
  initialData,
}: UserAddFormProps) => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

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
      new FormData(e.currentTarget)
    ) as unknown as AddUserFormData;

    if (!userId && mode === "update") {
      setError("User ID is required for updating.");

      return;
    }

    const updateData = {
      ...data,
      _id: userId as string,
    };

    console.log('updateDate: ', updateData);

    try {
      if (mode === "add") {
        dispatch(userRegister(data, onClose));
      } else if (mode === "update") {
        dispatch(userUpdate(updateData, onClose));
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error" + error);
      setError(
        `Error ${mode === "add" ? "creating" : "updating"} employee, try again later!`
      );
    }
  };

  return (
    <>
      {mode === "add" ? (
        <Button color="primary" onPress={onOpen}>
          Add User
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
                  {mode === "add" ? "Add User" : "Update User"}
                </ModalHeader>
                <ModalBody>
                  <Input
                    isRequired
                    defaultValue={initialData?.email}
                    errorMessage="Please enter a valid Email"
                    label="Email"
                    name="email"
                    placeholder="Enter email address"
                    startContent={
                      <UserIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    type="email"
                    variant="bordered"
                  />
                  <Input
                    isRequired
                    defaultValue={initialData?.name}
                    errorMessage="Please enter a valid name"
                    label="Name"
                    name="name"
                    placeholder="Enter name"
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
                    {mode === "add" ? "Add User" : "Update User"}
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

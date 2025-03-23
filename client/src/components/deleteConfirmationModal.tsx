import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";

import { DeleteIcon } from "./icons";

import api from "@/services/api";

interface DeleteConfirmationFormProps {
  employeeId: number;
  onEmployeeDeleted: () => void;
}

export const DeleteConfirmationForm = ({
  employeeId,
  onEmployeeDeleted,
}: DeleteConfirmationFormProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);

    try {
      const response = await api.delete(`/v1/employees/${employeeId}`);

      if (response.data.success) {
        onOpenChange();
        onEmployeeDeleted();
      }
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.error("Error deleting employee:", error.message);
        setError("Error deleting employee, try again later!");
      } else {
        // eslint-disable-next-line no-console
        console.error("Error deleting employee");
        setError("Error deleting employee, try again later!");
      }
    }
  };

  return (
    <>
      <button className="text-red-500 hover:text-red-700" onClick={onOpen}>
        <DeleteIcon />
      </button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Deletion
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this employee?</p>
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
                <Button color="primary" onPress={handleDelete}>
                  Confirm Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
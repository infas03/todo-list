import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
} from "@heroui/react";
import { useState } from "react";

import { DeleteIcon } from "./icons";

interface DeleteConfirmationFormProps {
  id: string;
  entityName: string;
  onConfirm: (id: string) => Promise<boolean>;
}

export const DeleteConfirmationForm = ({
  id,
  entityName,
  onConfirm,
}: DeleteConfirmationFormProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    const success = await onConfirm(id);

    if (!success) {
      setError(`Failed to delete ${entityName}`);
    } else {
      onOpenChange();
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        className="text-red-500 hover:text-red-700"
        data-testid="open-delete-modal-button"
        onClick={onOpen}
      >
        {isDeleting ? <Spinner color="primary" /> : <DeleteIcon />}
      </button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Deletion
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this {entityName}?</p>
                {error && <p className="text-red-500">{error}</p>}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  data-testid="cancel-delete-button"
                  disabled={isDeleting}
                  type="button"
                  variant="flat"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  data-testid="confirm-delete-button"
                  disabled={isDeleting}
                  isLoading={isDeleting}
                  onPress={handleDelete}
                >
                  {isDeleting ? "" : "Confirm Delete"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

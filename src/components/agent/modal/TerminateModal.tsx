import agentApi from "@/services/agent.service";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function TerminateModal({
  isOpen,
  onClose,
  onOpenChange,
  agentId,
}: {
  isOpen: boolean;
  onClose?: () => void;
  onOpenChange: () => void;
  agentId: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const handleTerminate = async () => {
    setIsLoading(true);
    toast.promise(
      async () => {
        try {
          await agentApi.terminateAgent(agentId);
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          onClose?.();
          setIsLoading(false);
        }
      },
      {
        loading: "Terminating agent...",
        success: "Agent terminated successfully",
        error: "Failed to terminate agent",
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="bottom-center"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center mt-4">
              Are you sure?
            </ModalHeader>
            <ModalBody>
              <p className="text-center text-secondary-text">
                You's lose offline access to all your assets sessions.
              </p>
            </ModalBody>
            <ModalFooter className="flex flex-col">
              <Button
                color="primary"
                variant="solid"
                isDisabled={isLoading}
                isLoading={isLoading}
                onPress={handleTerminate}
                className="w-full rounded-full font-semibold"
              >
                Yes
              </Button>
              <Button
                color="danger"
                variant="solid"
                onPress={onClose}
                className="w-full rounded-full bg-secondary-background text-secondary font-semibold"
              >
                No
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

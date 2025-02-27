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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleTerminate = async () => {
    setIsLoading(true);
    toast.promise(
      async () => {
        try {
          await agentApi.terminateAgent(agentId);
          navigate("/agent");
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
        error: (error) => error.response.data.message,
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
                You will lose offline access to all your assets and this agent
                will be deleted.
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

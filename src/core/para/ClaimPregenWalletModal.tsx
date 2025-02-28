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
// import { useNavigate } from "react-router-dom";

export default function ClaimPregenWalletModal({
  isOpen,
  onClose,
  onOpenChange,
  handleClaimWallet,
}: {
  isOpen: boolean;
  onClose?: () => void;
  onOpenChange: () => void;
  handleClaimWallet: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const handleClaim = async () => {
    setIsLoading(true);
    toast.promise(
      async () => {
        try {
          await handleClaimWallet();
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          onClose?.();
          setIsLoading(false);
        }
      },
      {
        loading: "Claiming wallet...",
        success: "Wallet claimed successfully",
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
                You are about to claim control of the pre-generated wallet. Once
                claimed, this agent bot will be removed, and you will have full
                access to the wallet. Do you want to proceed?
              </p>
            </ModalBody>
            <ModalFooter className="flex flex-col">
              <Button
                color="primary"
                variant="solid"
                isDisabled={isLoading}
                isLoading={isLoading}
                onPress={handleClaim}
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

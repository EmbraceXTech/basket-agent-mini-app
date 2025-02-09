import { IAgent } from "@/interfaces/agent";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

export default function TokenModal({
  isOpen,
  onOpenChange,
  agent,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  agent?: IAgent;
}) {
  return (
    <Modal
      isOpen={isOpen}
      placement="bottom-center"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Agnet ID:{agent?.id}
            </ModalHeader>
            <ModalBody>
              {agent?.selectedTokens.map((token) => (
                <div
                  className="flex justify-between items-center gap-2"
                  key={token.tokenAddress}
                >
                  <div>{token.tokenSymbol}</div>
                  <div>price...</div>
                </div>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose} className="w-full">
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

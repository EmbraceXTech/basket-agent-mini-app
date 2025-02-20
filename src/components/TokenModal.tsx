import { IAgent } from "@/interfaces/agent";
import tokenApi from "@/services/token.service";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

export default function TokenModal({
  isOpen,
  onOpenChange,
  agent,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  agent?: IAgent;
}) {
  const { data: walletBalances, isLoading } = useQuery({
    queryKey: ["agent-wallet-balance", agent?.id],
    queryFn: () =>
      tokenApi.getTokenBalance(agent?.id?.toString() ?? "", {
        chainId: agent?.chainId,
      }),
    enabled: !!agent?.id,
  });
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
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                walletBalances?.tokens?.map((token) => (
                  <div
                    className="flex justify-between items-center gap-2"
                    key={token[0]}
                  >
                    <div>{token[0]}</div>
                    <div>{token[1]}</div>
                  </div>
                ))
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                className="w-full"
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

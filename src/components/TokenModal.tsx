import { IAgent } from "@/interfaces/agent";
import agentApi from "@/services/agent.service";
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
    queryFn: () => agentApi.getAgentWalletBalance(agent?.id ?? 0),
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
                walletBalances?.map((walletBalance) => (
                  <div
                    className="flex justify-between items-center gap-2"
                    key={walletBalance.tokenSymbol}
                >
                  <div>{walletBalance.tokenSymbol}</div>
                  <div>{walletBalance.balance}</div>
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

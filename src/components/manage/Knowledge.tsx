import { IKnowledge } from "@/interfaces/knowledge";
import { IAgentInfo } from "@/interfaces/agent";
import KnowledgeForm from "../agent/form/KnowledgeForm";

export default function ManageKnowledge({
  agentInfo,
  setKnowledgeBase,
}: {
  agentInfo: IAgentInfo;
  setKnowledgeBase: (knowledge: IKnowledge[]) => void;
}) {
  return (
    <>
      <KnowledgeForm
        data={agentInfo.knowledge}
        setData={(knowledges) =>
          setKnowledgeBase(
            knowledges.map((k, index) => ({
              ...k,
              agentId: agentInfo.id,
              id: index + 1,
            }))
          )
        }
      />
    </>
  );
}

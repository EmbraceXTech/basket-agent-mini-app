import { IUpdateKnowledgeRequest } from "@/interfaces/knowledge";
import { IAgentInfo } from "@/interfaces/agent";
import KnowledgeForm from "../agent/form/KnowledgeForm";

export default function ManageKnowledge({
  agentInfo,
  setKnowledgeBase,
  setRemoveKnowledgeIds,
}: {
  agentInfo: IAgentInfo;
  setKnowledgeBase: (knowledge: IUpdateKnowledgeRequest[]) => void;
  setRemoveKnowledgeIds: (ids: number[]) => void;
}) {
  return (
    <>
      <KnowledgeForm
        data={agentInfo.knowledge}
        setData={(knowledges) => setKnowledgeBase(knowledges as IUpdateKnowledgeRequest[])}
        setRemoveKnowledgeIds={(ids: number[]) => setRemoveKnowledgeIds(ids)}
      />
    </>
  );
}

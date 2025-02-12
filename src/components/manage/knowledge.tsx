import { useEffect, useState } from "react";
import { Button, Input } from "@heroui/react";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

import { IKnowledge } from "@/interfaces/knowledge";
import { IAgentInfo } from "@/interfaces/agent";

export default function ManageKnowledge({
  agentInfo,
  setKnowledgeBase,
}: {
  agentInfo: IAgentInfo;
  setKnowledgeBase: (knowledge: IKnowledge[]) => void;
}) {
  const [_knowledgeBase, _setKnowledgeBase] = useState<IKnowledge[]>(
    agentInfo?.knowledge ?? []
  );

  useEffect(() => {
    setKnowledgeBase(_knowledgeBase);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_knowledgeBase]);

  const handleAddKnowledge = () => {
    const newKnowledge = {
      id: _knowledgeBase.length + 1,
      name: "",
      content: "",
      agentId: agentInfo.id,
    };
    _setKnowledgeBase((prev) => [...prev, newKnowledge]);
  };
  const handleDeleteKnowledge = (id: number) => {
    _setKnowledgeBase((prev) => prev.filter((knowledge) => knowledge.id !== id));
  };
  const handleChangeKnowledgeName = (name: string, id: number) => {
    _setKnowledgeBase((prev) =>
      prev.map((knowledge) =>
        knowledge.id === id ? { ...knowledge, name } : knowledge
      )
    );
  };
  const handleChangeKnowledgeValue = (value: string, id: number) => {
    _setKnowledgeBase((prev) =>
      prev.map((knowledge) =>
        knowledge.id === id ? { ...knowledge, content: value } : knowledge
      )
    );
  };
  return (
    <div>
      <div className="grid grid-cols-9 gap-3 mb-4">
        <div className="text-[#AEB2BD] text-xs col-span-1 flex items-center">
          #
        </div>
        <div className="text-[#AEB2BD] text-xs col-span-3">Knowledge Name</div>
        <div className="text-[#AEB2BD] text-xs col-span-3">Value</div>
        <div className="text-[#AEB2BD] text-xs col-span-2"></div>
        {_knowledgeBase.map((knowledge) => (
          <>
            <div key={knowledge.id} className="col-span-1 flex items-center">
              {knowledge.id}
            </div>
            <Input
              value={knowledge.name}
              onChange={(e) =>
                handleChangeKnowledgeName(e.target.value, knowledge.id)
              }
              className="col-span-3"
            />
            <Input
              value={knowledge.content}
              onChange={(e) =>
                handleChangeKnowledgeValue(e.target.value, knowledge.id)
              }
              className="col-span-3"
            />
            <div className="col-span-2 flex w-fit">
              <Button
                onPress={() => handleDeleteKnowledge(knowledge.id)}
                // isIconOnly
              >
                <MinusCircleIcon className="w-5 h-5" />
              </Button>
            </div>
          </>
        ))}
      </div>
      <Button
        onPress={handleAddKnowledge}
        className="w-full rounded-full"
        startContent={<PlusCircleIcon className="w-5 h-5" />}
      >
        Add Knowledge
      </Button>
    </div>
  );
}

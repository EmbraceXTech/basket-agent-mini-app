import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

import { IKnowledgeRequest } from "@/interfaces/knowledge";

export default function ManageKnowledge() {
  const [knowledgeBase, setKnowledgeBase] = useState<
    (IKnowledgeRequest & { id: number })[]
  >([]);

  const handleAddKnowledge = () => {
    const newKnowledge = {
      id: knowledgeBase.length + 1,
      name: "",
      content: "",
    };
    setKnowledgeBase((prev) => [...prev, newKnowledge]);
  };
  const handleDeleteKnowledge = (id: number) => {
    setKnowledgeBase((prev) => prev.filter((knowledge) => knowledge.id !== id));
  };
  const handleChangeKnowledgeName = (name: string, id: number) => {
    setKnowledgeBase((prev) =>
      prev.map((knowledge) =>
        knowledge.id === id ? { ...knowledge, name } : knowledge
      )
    );
  };
  const handleChangeKnowledgeValue = (value: string, id: number) => {
    setKnowledgeBase((prev) =>
      prev.map((knowledge) =>
        knowledge.id === id ? { ...knowledge, content: value } : knowledge
      )
    );
  };
  return (
    <div>
      <div className="grid grid-cols-9 gap-3 mb-4">
        <div className="text-[#AEB2BD] text-xs col-span-1 flex items-center">#</div>
        <div className="text-[#AEB2BD] text-xs col-span-3">Knowledge Name</div>
        <div className="text-[#AEB2BD] text-xs col-span-3">Value</div>
        <div className="text-[#AEB2BD] text-xs col-span-2"></div>
        {knowledgeBase.map((knowledge) => (
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

import { Button } from "@heroui/button";
import { Input } from "@heroui/react";
import { useEffect, useState } from "react";

import { IKnowledgeRequest } from "@/interfaces/knowledge";
import useStepperStore from "@/stores/createAgent.store";

import FormHeader from "./FormHeader";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

// add knowledge base
export default function Step3() {
  const { data, setData, setCanNext } = useStepperStore();
  const [knowledgeBase, setKnowledgeBase] = useState<
    (IKnowledgeRequest & { id: number })[]
  >(
    data.knowledges?.map((knowledge, key) => ({
      id: key + 1,
      name: knowledge.name,
      content: knowledge.content,
    })) ?? [
      {
        id: 1,
        name: "",
        content: "",
      },
    ]
  );
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
  const mapToKnowledgeRequest = (knowledge: (typeof knowledgeBase)[0]) => ({
    name: knowledge.name,
    content: knowledge.content,
  });
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

  useEffect(() => {
    setCanNext(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setData({ knowledges: knowledgeBase.map(mapToKnowledgeRequest) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knowledgeBase]);
  return (
    <div>
      <FormHeader
        title="Add Knowledge"
        description="Choose one of the templates or create a custom one with prompt."
      />
      <div className="grid grid-cols-9 gap-3 mb-4">
        <div className="text-[#AEB2BD] text-xs col-span-1">#</div>
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

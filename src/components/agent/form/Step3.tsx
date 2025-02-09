import { IKnowledgeRequest } from "@/interfaces/knowledge";
import useStepperStore from "@/stores/createAgent.store";
import { Button } from "@heroui/button";
import { Input } from "@heroui/react";
import { useEffect, useState } from "react";

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
      <div className="grid grid-cols-4">
        <div>#</div>
        <div>Knowledge Name</div>
        <div>Value</div>
        <div></div>
        {knowledgeBase.map((knowledge) => (
          <>
            <div key={knowledge.id}>{knowledge.id}</div>
            <Input
              value={knowledge.name}
              onChange={(e) =>
                handleChangeKnowledgeName(e.target.value, knowledge.id)
              }
            />
            <Input
              value={knowledge.content}
              onChange={(e) =>
                handleChangeKnowledgeValue(e.target.value, knowledge.id)
              }
            />
            <div>
              <Button onPress={() => handleDeleteKnowledge(knowledge.id)}>
                Delete
              </Button>
            </div>
          </>
        ))}
      </div>
      <Button onPress={handleAddKnowledge}>Add Knowledge</Button>
    </div>
  );
}

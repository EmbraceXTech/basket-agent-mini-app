import { IKnowledge } from "@/interfaces/knowledge";
import { Button } from "@heroui/button";
import { Input } from "@heroui/react";
import { useState } from "react";

// add knowledge base
export default function Step3() {
  const [knowledgeBase, setKnowledgeBase] = useState<
    (IKnowledge & { id: number })[]
  >([
    {
      id: 1,
      name: "Knowledge 1",
      value: "Knowledge 1 value",
    },
  ]);
  const handleAddKnowledge = () => {
    setKnowledgeBase([
      ...knowledgeBase,
      { id: knowledgeBase.length + 1, name: "", value: "" },
    ]);
  };
  const handleDeleteKnowledge = (id: number) => {
    setKnowledgeBase(knowledgeBase.filter((knowledge) => knowledge.id !== id));
  };
  const handleChangeKnowledgeName = (name: string, id: number) => {
    setKnowledgeBase(
      knowledgeBase.map((knowledge) => {
        if (knowledge.id === id) {
          return { ...knowledge, name };
        }
        return knowledge;
      })
    );
  };
  const handleChangeKnowledgeValue = (value: string, id: number) => {
    setKnowledgeBase(
      knowledgeBase.map((knowledge) => {
        if (knowledge.id === id) {
          return { ...knowledge, value };
        }
        return knowledge;
      })
    );
  };

  return (
    <div>
      <div className="grid grid-cols-4">
        <div>#</div>
        <div>Knowledge Name</div>
        <div>Value</div>
        <div></div>
        {knowledgeBase.map((knowledge) => (
          <>
            <div>{knowledge.id}</div>
            <Input
              value={knowledge.name}
              onChange={(e) =>
                handleChangeKnowledgeName(e.target.value, knowledge.id)
              }
            />
            <Input
              value={knowledge.value}
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

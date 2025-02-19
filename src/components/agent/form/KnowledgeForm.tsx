import { Button } from "@heroui/button";
import { Divider, Input } from "@heroui/react";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { MinusCircleIcon } from "@heroicons/react/24/solid";

import { IKnowledgeRequest } from "@/interfaces/knowledge";
import { formatNumber } from "@/utils/format.util";

export default function KnowledgeForm({
  data,
  setData,
}: {
  data: IKnowledgeRequest[];
  setData: (data: IKnowledgeRequest[]) => void;
}) {
  const [knowledgeBase, setKnowledgeBase] = useState(
    data?.map((knowledge, key) => ({
      id: key + 1,
      ...knowledge,
    })) ?? [{ id: 1, name: "", content: "" }]
  );

  const updateKnowledgeBase = (
    id: number,
    changes: Partial<IKnowledgeRequest>
  ) => {
    setKnowledgeBase((prev) =>
      prev.map((knowledge) =>
        knowledge.id === id ? { ...knowledge, ...changes } : knowledge
      )
    );
  };

  const handleAddKnowledge = () => {
    setKnowledgeBase((prev) => [
      ...prev,
      { id: prev.length + 1, name: "", content: "" },
    ]);
  };

  const handleDeleteKnowledge = (id: number) => {
    setKnowledgeBase((prev) =>
      prev
        .filter((knowledge) => knowledge.id !== id)
        .map((k, index) => ({
          ...k,
          id: index + 1,
        }))
    );
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setData(knowledgeBase.map(({ id, ...rest }) => rest));
  }, [knowledgeBase, setData]);

  return (
    <div>
      {knowledgeBase.map((knowledge) => (
        <>
          <div key={knowledge.id} className="flex items-center">
            <div className="grid grid-cols-9 gap-3 mb-4 flex-1">
              <div className="contents">
                <div className="text-[#AEB2BD] text-xs col-span-1">#</div>
                <div className="text-[#AEB2BD] text-xs col-span-8">
                  Knowledge Name
                </div>
                <div className="col-span-1 flex items-center">
                  {formatNumber(knowledge.id)}
                </div>
                <Input
                  value={knowledge.name}
                  onChange={(e) =>
                    updateKnowledgeBase(knowledge.id, { name: e.target.value })
                  }
                  className="col-span-8"
                />
                <div className="text-[#AEB2BD] text-xs col-span-1" />
                <div className="text-[#AEB2BD] text-xs col-span-8">Value</div>
                <div className="text-[#AEB2BD] text-xs col-span-1" />
                <Input
                  value={knowledge.content}
                  onChange={(e) =>
                    updateKnowledgeBase(knowledge.id, {
                      content: e.target.value,
                    })
                  }
                  className="col-span-8"
                />
              </div>
            </div>
            <Button
              onPress={() => handleDeleteKnowledge(knowledge.id)}
              variant="light"
              isIconOnly
              color="danger"
            >
              <MinusCircleIcon className="w-8 h-8" />
            </Button>
          </div>
          <Divider className="my-3" />
        </>
      ))}

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

{
  /* <div className="col-span-2 flex w-fit">
<Button onPress={() => handleDeleteKnowledge(knowledge.id)}>
  <MinusCircleIcon className="w-5 h-5" />
</Button>
</div> */
}

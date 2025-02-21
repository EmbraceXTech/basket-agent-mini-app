import { Button } from "@heroui/button";
import { Divider, Input, Textarea } from "@heroui/react";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { MinusCircleIcon } from "@heroicons/react/24/solid";

import {
  IKnowledgeRequest,
  IUpdateKnowledgeRequest,
} from "@/interfaces/knowledge";
import { formatNumber } from "@/utils/format.util";

export default function KnowledgeForm({
  data,
  setData,
  setRemoveKnowledgeIds,
}: {
  data: IKnowledgeRequest[];
  setData: (data: (IKnowledgeRequest | IUpdateKnowledgeRequest)[]) => void;
  setRemoveKnowledgeIds?: (ids: number[]) => void;
}) {
  const [knowledgeBase, setKnowledgeBase] = useState(
    data?.map((knowledge, key) => ({
      _id: key + 1,
      ...knowledge,
    })) ?? [{ _id: 1, name: "", content: "" }]
  );

  const updateKnowledgeBase = (
    _id: number,
    changes: Partial<IKnowledgeRequest>
  ) => {
    setKnowledgeBase((prev) =>
      prev.map((knowledge) =>
        knowledge._id === _id ? { ...knowledge, ...changes } : knowledge
      )
    );
  };

  const handleAddKnowledge = () => {
    setKnowledgeBase((prev) => [
      ...prev,
      { _id: prev.length + 1, name: "", content: "" },
    ]);
  };

  const handleDeleteKnowledge = (_id: number) => {
    setKnowledgeBase((prev) =>
      prev
        .filter((knowledge) => knowledge._id !== _id)
        .map((k, index) => ({
          ...k,
          _id: index + 1,
        }))
    );
    const removeKnowledgeIds = knowledgeBase.find(
      (knowledge) => knowledge._id === _id
    )?.id;
    if (removeKnowledgeIds) {
      setRemoveKnowledgeIds?.([removeKnowledgeIds]);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setData(knowledgeBase.map(({ _id, ...rest }) => rest));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knowledgeBase]);

  return (
    <div>
      {knowledgeBase.map((knowledge) => (
        <div key={knowledge._id}>
          <div key={knowledge.id} className="flex items-center">
            <div className="grid grid-cols-9 gap-3 mb-4 flex-1">
              <div className="contents">
                <div className="text-[#AEB2BD] text-xs col-span-1">#</div>
                <div className="text-[#AEB2BD] text-xs col-span-8">
                  Knowledge Name
                </div>
                <div className="col-span-1 flex items-center">
                  {formatNumber(knowledge._id)}
                </div>
                <Input
                  value={knowledge.name}
                  onChange={(e) =>
                    updateKnowledgeBase(knowledge._id, {
                      name: e.target.value,
                    })
                  }
                  className="col-span-8"
                />
                <div className="text-[#AEB2BD] text-xs col-span-1" />
                <div className="text-[#AEB2BD] text-xs col-span-8">Value</div>
                <div className="text-[#AEB2BD] text-xs col-span-1" />
                <Textarea
                  value={knowledge.content}
                  onChange={(e) =>
                    updateKnowledgeBase(knowledge._id, {
                      content: e.target.value,
                    })
                  }
                  className="col-span-8"
                />
              </div>
            </div>
            <Button
              onPress={() => handleDeleteKnowledge(knowledge._id)}
              variant="light"
              isIconOnly
              color="danger"
            >
              <MinusCircleIcon className="w-8 h-8" />
            </Button>
          </div>
          <Divider className="my-3" />
        </div>
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

import { useEffect } from "react";

import useStepperStore from "@/stores/createAgent.store";

import FormHeader from "./FormHeader";
import KnowledgeForm from "./KnowledgeForm";

// add knowledge base
export default function Step3() {
  const { data, setData, setCanNext } = useStepperStore();
  const knowledgeBase = data.knowledges?.map((knowledge, key) => ({
    id: key + 1,
    name: knowledge.name,
    content: knowledge.content,
  })) ?? [
    {
      id: 1,
      name: "",
      content: "",
    },
  ];

  useEffect(() => {
    setCanNext(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <FormHeader
        title="Add Knowledge"
        description="Choose one of the templates or create a custom one with prompt."
      />
      <KnowledgeForm
        data={knowledgeBase}
        setData={(knowledge) => setData({ knowledges: knowledge })}
      />
    </div>
  );
}

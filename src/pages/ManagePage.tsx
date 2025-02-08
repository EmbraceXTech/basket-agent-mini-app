import { Button } from "@heroui/react";
import { useParams } from "react-router-dom";

import { Page } from "@/components/base/Page";
import Header from "@/components/layout/Header";

export default function ManagePage() {
  const { id } = useParams();
  console.log(id);
  return (
    <Page back={true}>
      <div className="w-full h-screen p-4 flex flex-col">
        <Header title="AI Page" />
        <div className="flex-1">Agent ID: {id}</div>
        <Button
          className="bg-blue-500 rounded-full text-white"
          variant="solid"
        >
          Start Now
        </Button>
      </div>
    </Page>
  );
}

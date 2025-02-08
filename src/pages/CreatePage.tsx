import { Button } from "@heroui/react";

import { Page } from "@/components/base/Page";
import Header from "@/components/layout/Header";

export default function CreatePage() {
  return (
    <Page back={false}>
      <div className="w-full h-screen p-4 flex flex-col">
        <Header title="Create Page" />
        <div className="flex-1">body</div>
        <Button className="bg-blue-500 rounded-full text-white" variant="solid">
          Create
        </Button>
      </div>
    </Page>
  );
}

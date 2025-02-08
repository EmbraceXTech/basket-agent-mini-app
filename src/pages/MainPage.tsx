import { ClockIcon, BellAlertIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/button";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "@/components/base/Link/Link";
import { Page } from "@/components/base/Page";
import Header from "@/components/layout/Header";

export default function MainPage() {
  const navigate = useNavigate();

  const handleCreate = async () => {
    navigate("/create");
  };

  const AgentTaskComponent = useMemo(() => {
    return <div>content</div>;
  }, []);
  return (
    <Page back={true}>
      <div className="w-full h-screen p-4 flex flex-col">
        <Header
          title="Main Page"
          right={
            <div className="flex items-center gap-2">
              <ClockIcon className="w-6 h-6" />
              <BellAlertIcon className="w-6 h-6" />
            </div>
          }
        />
        <div className="flex-1">{AgentTaskComponent}</div>
        <Link to="/test/index">To Test Page</Link>
        <Button
          startContent={<PlusCircleIcon className="w-4 h-4" />}
          className="bg-[#FF4F29] rounded-full text-white"
          variant="solid"
          onPress={handleCreate}
        >
          Create
        </Button>
      </div>
    </Page>
  );
}

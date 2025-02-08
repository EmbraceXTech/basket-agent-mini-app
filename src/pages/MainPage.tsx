import { List } from "@telegram-apps/telegram-ui";

import { Link } from "@/components/base/Link/Link";
import { Page } from "@/components/base/Page";

export default function MainPage() {
  return (
    <Page back={false}>
      <List>
        <h1>Main Page</h1>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <Link to="/test/index">To Test Page</Link>
      </List>
    </Page>
  );
}

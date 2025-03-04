import { Section, Cell, List } from "@telegram-apps/telegram-ui";
import type { FC } from "react";

import { Link } from "@/components/base/Link/Link";
import { Page } from "@/components/base/Page";

export const IndexPage: FC = () => {
  return (
    <Page back={false}>
      <List>
        <Section
          header="Application Launch Data"
          footer="These pages help developer to learn more about current launch information"
        >
          <Link to="/test/init-data">
            <Cell subtitle="User data, chat information, technical data">
              Init Data
            </Cell>
          </Link>
          <Link to="/test/launch-params">
            <Cell subtitle="Platform identifier, Mini Apps version, etc.">
              Launch Parameters
            </Cell>
          </Link>
          <Link to="/test/theme-params">
            <Cell subtitle="Telegram application palette information">
              Theme Parameters
            </Cell>
          </Link>
        </Section>
      </List>
    </Page>
  );
};

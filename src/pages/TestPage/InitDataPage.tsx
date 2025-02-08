import { type FC, useEffect, useMemo, useState } from "react";
import { initData, type User, useSignal } from "@telegram-apps/sdk-react";
import { Button, List, Placeholder, Text } from "@telegram-apps/telegram-ui";

import {
  DisplayData,
  type DisplayDataRow,
} from "@/components/base/DisplayData/DisplayData";
import { Page } from "@/components/base/Page";
import { getAccessToken, useLinkAccount, usePrivy } from "@privy-io/react-auth";

function getUserRows(user: User): DisplayDataRow[] {
  return [
    { title: "id", value: user.id.toString() },
    { title: "username", value: user.username },
    { title: "photo_url", value: user.photoUrl },
    { title: "last_name", value: user.lastName },
    { title: "first_name", value: user.firstName },
    { title: "is_bot", value: user.isBot },
    { title: "is_premium", value: user.isPremium },
    { title: "language_code", value: user.languageCode },
    { title: "allows_to_write_to_pm", value: user.allowsWriteToPm },
    { title: "added_to_attachment_menu", value: user.addedToAttachmentMenu },
  ];
}

export const InitDataPage: FC = () => {
  const initDataRaw = useSignal(initData.raw);
  const initDataState = useSignal(initData.state);

  const [token, setToken] = useState<string | null>(null);

  const [linkTelegramError, setLinkTelegramError] = useState<string | null>(
    null
  );
  const [linkTelegramSuccess, setLinkTelegramSuccess] = useState<string | null>(
    null
  );

  const { authenticated, user, login, linkTelegram } = usePrivy();
  const { linkTelegram: linkTelegramPrivy } = useLinkAccount({
    onSuccess: () => {
      setLinkTelegramSuccess("Telegram linked successfully");
    },
    onError: (error) => {
      setLinkTelegramError(`Error linking Telegram: ${error}`);
    },
  });

  useEffect(() => {
    getAccessToken().then((token) => {
      console.log("token:", token);
      setToken(token);
    });
  }, []);

  const initDataRows = useMemo<DisplayDataRow[] | undefined>(() => {
    if (!initDataState || !initDataRaw) {
      return;
    }
    const {
      authDate,
      hash,
      queryId,
      chatType,
      chatInstance,
      canSendAfter,
      startParam,
    } = initDataState;
    return [
      { title: "raw", value: initDataRaw },
      { title: "auth_date", value: authDate.toLocaleString() },
      { title: "auth_date (raw)", value: authDate.getTime() / 1000 },
      { title: "hash", value: hash },
      {
        title: "can_send_after",
        value: initData.canSendAfterDate()?.toISOString(),
      },
      { title: "can_send_after (raw)", value: canSendAfter },
      { title: "query_id", value: queryId },
      { title: "start_param", value: startParam },
      { title: "chat_type", value: chatType },
      { title: "chat_instance", value: chatInstance },
    ];
  }, [initDataState, initDataRaw]);

  const userRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initDataState && initDataState.user
      ? getUserRows(initDataState.user)
      : undefined;
  }, [initDataState]);

  const receiverRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initDataState && initDataState.receiver
      ? getUserRows(initDataState.receiver)
      : undefined;
  }, [initDataState]);

  const chatRows = useMemo<DisplayDataRow[] | undefined>(() => {
    if (!initDataState?.chat) {
      return;
    }
    const { id, title, type, username, photoUrl } = initDataState.chat;

    return [
      { title: "id", value: id.toString() },
      { title: "title", value: title },
      { title: "type", value: type },
      { title: "username", value: username },
      { title: "photo_url", value: photoUrl },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData]);

  if (!initDataRows) {
    return (
      <Page>
        <Placeholder
          header="Oops"
          description="Application was launched with missing init data"
        >
          <img
            alt="Telegram sticker"
            src="https://xelene.me/telegram.gif"
            style={{ display: "block", width: "144px", height: "144px" }}
          />
        </Placeholder>
      </Page>
    );
  }
  return (
    <Page>
      <Button onClick={() => login({ loginMethods: ["telegram", "email"] })}>
        Login
      </Button>
      <Button onClick={() => linkTelegram({ launchParams: { initDataRaw } })}>
        Link Telegram
      </Button>
      <Button onClick={() => linkTelegramPrivy()}>Link Telegram Privy</Button>
      {linkTelegramError && <div>{linkTelegramError}</div>}
      {linkTelegramSuccess && <div>{linkTelegramSuccess}</div>}
      <div>{authenticated ? "true" : "false"}</div>
      <div>{user?.telegram?.telegramUserId}</div>
      <div>{user?.telegram?.username}</div>
      {authenticated && (
        <div>
          <Text>Access Token: {token}</Text>
          <Text>Telegram ID: {user?.telegram?.telegramUserId}</Text>
          <Text>Telegram Username: {user?.telegram?.username}</Text>
        </div>
      )}
      <List>
        <DisplayData header={"Init Data"} rows={initDataRows} />
        {userRows && <DisplayData header={"User"} rows={userRows} />}
        {receiverRows && (
          <DisplayData header={"Receiver"} rows={receiverRows} />
        )}
        {chatRows && <DisplayData header={"Chat"} rows={chatRows} />}
      </List>
    </Page>
  );
};

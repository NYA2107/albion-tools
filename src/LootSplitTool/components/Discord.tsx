import { CloseCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import { Button, Input, Space, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import _ from "lodash";
import { FC, useEffect, useState } from "react";

export interface DiscordWebhookType {
  id: string;
  title: string;
  url: string;
}

export interface DiscordPropsType {
  splitLootTitle: string;
  webhookUrl: string;
  onTitleChange: (value: string) => void;
  onWebhookChange: (value: string) => void;
  onSendToDiscord: () => void;
}

const Discord: FC<DiscordPropsType> = (props) => {
  const {
    splitLootTitle,
    webhookUrl,
    onSendToDiscord,
    onTitleChange,
    onWebhookChange,
  } = props;

  const [webhooks, setWebhooks] = useState<DiscordWebhookType[]>([]);

  useEffect(() => {
    const webhookStorage = localStorage.getItem("webhooks");

    const parsedWebhookStorage: DiscordWebhookType[] = JSON.parse(
      webhookStorage || "[]"
    );
    console.log(webhookStorage, parsedWebhookStorage, "STORAGE");
    setWebhooks(parsedWebhookStorage);
  }, []);

  useEffect(() => {
    localStorage.setItem("webhooks", JSON.stringify(webhooks));
  }, [webhooks]);

  const handleAddWebhook = () => {
    const temp: DiscordWebhookType[] = JSON.parse(JSON.stringify(webhooks));
    temp.push({
      id: `WEBHOOK-${Math.random()}`,
      title: "",
      url: "",
    });
    setWebhooks(temp);
  };

  const handleRemoveWebhook = (rowId: string) => {
    let temp: DiscordWebhookType[] = JSON.parse(JSON.stringify(webhooks));
    temp = temp.filter((v) => v.id !== rowId);
    setWebhooks(temp);
  };

  const handleChangeWebhook = (rowId: string, path: string, value: string) => {
    let temp: DiscordWebhookType[] = JSON.parse(JSON.stringify(webhooks));
    const index = temp.findIndex((v) => v.id === rowId);
    if (index < 0) return;
    temp = _.set(temp, [index, path], value);
    setWebhooks(temp);
  };

  const handleUseWebhook = (rowId: string) => {
    const temp: DiscordWebhookType[] = JSON.parse(JSON.stringify(webhooks));
    const index = temp.findIndex((v) => v.id === rowId);
    if (index < 0) return;
    onWebhookChange(_.get(temp, [index, "url"], ""));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "2em",
      }}
    >
      <Space direction="vertical">
        <Typography.Text>Send To Discord</Typography.Text>
        <TextArea
          style={{ width: "400px" }}
          placeholder="Loot Split Title"
          value={splitLootTitle}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <Space>
          <Input
            value={webhookUrl}
            placeholder="Webhook discord"
            onChange={(e) => onWebhookChange(e.target.value)}
          />
          <Button
            onClick={() => {
              onSendToDiscord();
            }}
            type="primary"
          >
            Send To Discord
          </Button>
        </Space>
      </Space>

      <Space direction="vertical">
        <Typography.Text>Saved Webhook Discord</Typography.Text>
        <Space style={{ width: "100%" }} direction="vertical">
          {webhooks.map((v) => {
            return (
              <div style={{ display: "flex", gap: "1em" }}>
                <Button
                  onClick={() => {
                    handleUseWebhook(v.id);
                  }}
                >
                  Use Webhook URL
                </Button>
                <Input
                  onChange={(e) =>
                    handleChangeWebhook(v.id, "title", e.target.value || "")
                  }
                  value={v.title}
                  placeholder="Webhook Title"
                />
                <Input
                  onChange={(e) =>
                    handleChangeWebhook(v.id, "url", e.target.value || "")
                  }
                  value={v.url}
                  placeholder="Webhook discord"
                />
                <Button
                  onClick={() => handleRemoveWebhook(v.id)}
                  icon={<CloseCircleFilled />}
                  danger
                >
                  Delete
                </Button>
              </div>
            );
          })}
        </Space>
        <Button
          icon={<PlusCircleFilled />}
          style={{ width: "100%" }}
          type="primary"
          onClick={handleAddWebhook}
        >
          Add Discord Webhook
        </Button>
      </Space>
    </div>
  );
};

export default Discord;

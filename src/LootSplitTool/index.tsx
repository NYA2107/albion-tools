import { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  FloatButton,
  Input,
  InputNumber,
  Space,
  Table,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import { MemberType } from "../PartyTimeTracker";
import TextArea from "antd/es/input/TextArea";
import {
  BorderlessTableOutlined,
  CaretUpOutlined,
  PercentageOutlined,
  SnippetsOutlined,
  UploadOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import ReducerAction from "./components/ReducerAction";
import calculateLootPartyPercentage from "../Global/helper/calculateLootPartyPercentage";

// interface LootReducerType {
//   name: string;
//   type: "percentage" | "exact-value";
//   value: number;
// }

const LootSplitTool = () => {
  const [memberList, setMemberList] = useState<MemberType[]>([]);
  // const [reducerList, setReducerList] = useState<LootReducerType[]>([]);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [totalLoot, setTotalLoot] = useState<number>(0);
  // const [totalLootNett, setTotalLootNett] = useState<number>(0);
  const [isOpenActionDrawer, setIsOpenActionDrawer] = useState<boolean>(false);

  useEffect(() => {
    // const jsonStorageData = localStorage.getItem("party-time-tracker-data");
    // if (jsonStorageData) {
    //   console.log(JSON.parse(jsonStorageData));
    // }
  }, []);

  const handleUsePreviousData = () => {
    const jsonStorageData = localStorage.getItem("party-time-tracker-data");
    const jsonElapsedTime = localStorage.getItem(
      "party-time-tracker-elapsed-time"
    );
    if (!jsonStorageData || !jsonElapsedTime) return;
    let storageData: MemberType[] = JSON.parse(jsonStorageData);
    const elapsedTime = parseInt(jsonElapsedTime);
    storageData = calculateLootPartyPercentage(storageData);
    setElapsedTime(elapsedTime);
    setMemberList(storageData);
  };

  const handleChangeTotalLoot = (newTotal: number) => {
    setTotalLoot(newTotal);
  };

  return (
    <div style={{ padding: "1em" }}>
      <FloatButton
        icon={<CaretUpOutlined />}
        type="primary"
        tooltip="Show action for loot splot tools"
        style={{ left: 50, bottom: 50, width: "60px", height: "60px" }}
        onClick={() => setIsOpenActionDrawer(true)}
      />
      <Drawer
        title="Loot Split Action"
        placement="bottom"
        onClose={() => {
          setIsOpenActionDrawer(false);
        }}
        open={isOpenActionDrawer}
      >
        <div>
          <Tabs
            tabPosition="left"
            defaultActiveKey="action-members"
            items={[
              {
                key: "action-data",
                label: (
                  <span>
                    <BorderlessTableOutlined /> Data
                  </span>
                ),
                children: (
                  <Space direction="vertical" style={{ width: "500px" }}>
                    <div>
                      <Typography.Text>Total Loot</Typography.Text>
                      <div>
                        <Tooltip
                          title={`${new Intl.NumberFormat("id-ID").format(
                            totalLoot
                          )}`}
                          trigger="focus"
                        >
                          <InputNumber
                            onChange={(value) =>
                              handleChangeTotalLoot(value || 0)
                            }
                            value={totalLoot}
                            style={{ width: "500px" }}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div>
                      <Typography.Text>Elapsed Time</Typography.Text>
                      <div>
                        <InputNumber
                          style={{ width: "500px" }}
                          value={elapsedTime}
                        />
                      </div>
                    </div>
                  </Space>
                ),
              },
              {
                key: "action-loot-reducer",
                label: (
                  <span>
                    <PercentageOutlined /> Loot Reducer
                  </span>
                ),
                children: <ReducerAction onAddLootReducer={() => {}} />,
              },
              {
                key: "action-members",
                label: (
                  <span>
                    <UsergroupAddOutlined /> Members
                  </span>
                ),
                children: (
                  <Space direction="vertical" style={{ width: "500px" }}>
                    <Typography.Text>Members</Typography.Text>
                    <TextArea
                      placeholder="Input members name, enter new line to add more"
                      rows={3}
                    />
                    <Button
                      type="primary"
                      icon={<UsergroupAddOutlined />}
                      style={{ margin: "5px" }}
                    >
                      Add New Party Member
                    </Button>
                  </Space>
                ),
              },

              {
                key: "action-import-data",
                label: (
                  <span>
                    <UploadOutlined /> Import Data
                  </span>
                ),
                children: (
                  <div style={{ marginBottom: "2em" }}>
                    <Button
                      style={{ margin: "5px" }}
                      onClick={handleUsePreviousData}
                      icon={<SnippetsOutlined />}
                    >
                      Use Previous Party Tracker Data
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Drawer>

      <Table
        key={"table-loot-split"}
        columns={[
          {
            title: "No",
            dataIndex: "no",
            key: "column-no",
          },
          {
            title: "Member",
            dataIndex: "name",
            key: "column-member",
            render: (text, record) => {
              return <Input key={`column-name-${record.id}`} value={text} />;
            },
          },
          {
            title: "Time Played",
            dataIndex: "timePlayed",
            key: "column-time-played",
            width: 200,
            render: (text, record) => {
              return (
                <InputNumber
                  key={`column-time-played-${record.id}`}
                  value={text}
                />
              );
            },
          },
          {
            title: "Loot Percentage",
            dataIndex: "splitPercentage",
            key: "column-loot-percentage",
            render: (text, record) => {
              return (
                <Typography.Text key={`column-loot-percentage-${record.id}`}>
                  {text} %
                </Typography.Text>
              );
            },
          },
          {
            title: "Loot Split",
            dataIndex: "lootSplit",
            key: "column-loot-split",
          },
          {
            title: "Action",
            dataIndex: "id",
            key: "column-action",
          },
        ]}
        dataSource={memberList}
      />
    </div>
  );
};

export default LootSplitTool;

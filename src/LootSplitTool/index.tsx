import { useRef, useState } from "react";
import {
  Button,
  Card,
  Drawer,
  FloatButton,
  Input,
  InputNumber,
  Space,
  Statistic,
  Table,
  Tabs,
  Tooltip,
  Tour,
  Typography,
  Upload,
  notification,
} from "antd";
import { MemberType } from "../PartyTimeTracker";
import {
  BorderlessTableOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  HolderOutlined,
  PercentageOutlined,
  ReloadOutlined,
  SnippetsOutlined,
  SubnodeOutlined,
  UploadOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ReducerAction from "./components/ReducerAction";
import calculateLootPartyPercentage from "../Global/helper/calculateLootPartyPercentage";
import calculateLootPartySummary from "../Global/helper/calculateLootPartySummary";
import NewPartyMemberAction from "./components/NewPartyMemberAction";
import { RcFile } from "antd/es/upload";
import _ from "lodash";

interface LootReducerType {
  id: string;
  name: string;
  type: "percentage" | "exact-value";
  value: number;
}

const LootSplitTool = () => {
  const floatButtonRef = useRef(null);
  const [api, contextHolder] = notification.useNotification();
  const [openTour, setOpenTour] = useState<boolean>(true);
  const [memberList, setMemberList] = useState<MemberType[]>([]);
  const [reducerList, setReducerList] = useState<LootReducerType[]>([]);
  const [totalLoot, setTotalLoot] = useState<number>(0);
  const [totalLootNett, setTotalLootNett] = useState<number>(0);
  const [isOpenActionDrawer, setIsOpenActionDrawer] = useState<boolean>(false);

  const calculateAll = (
    memberList: MemberType[],
    reducerList: LootReducerType[],
    totalLoot: number
  ) => {
    let lootNett = totalLoot;
    let tempMemberList: MemberType[] = JSON.parse(JSON.stringify(memberList));
    reducerList.map((v) => {
      const type = v.type;
      const value = v.value;
      if (type === "exact-value") {
        lootNett -= value;
      } else if (type === "percentage") {
        lootNett = lootNett - (lootNett * value) / 100;
      }
    });
    tempMemberList = calculateLootPartyPercentage(memberList);
    tempMemberList = tempMemberList.map((v) => {
      if (!v.splitPercentage) return v;
      return Object.assign(v, {
        lootSplit: (v.splitPercentage / 100) * lootNett,
      });
    });
    setTotalLootNett(lootNett);
    setMemberList(tempMemberList);
  };

  const handleUsePreviousData = () => {
    const jsonStorageData = localStorage.getItem("party-time-tracker-data");
    if (!jsonStorageData) return;
    let storageData: MemberType[] = JSON.parse(jsonStorageData);
    storageData = calculateLootPartySummary(storageData);
    calculateAll(storageData, reducerList, totalLoot);
  };

  const handleChangeTotalLoot = (newTotal: number) => {
    setTotalLoot(newTotal);
    calculateAll(memberList, reducerList, newTotal);
  };

  const handleAddLootReducer = (
    name: string,
    type: "percentage" | "exact-value",
    value: number
  ) => {
    const tempReducer: LootReducerType[] = JSON.parse(
      JSON.stringify(reducerList)
    );
    tempReducer.push({ id: `Reducer-${Math.random()}`, name, type, value });
    calculateAll(memberList, tempReducer, totalLoot);
    setReducerList(tempReducer);
  };

  const handleDragReducer = (from: number, to?: number) => {
    if (to === undefined) return;
    const tempReducer: LootReducerType[] = JSON.parse(
      JSON.stringify(reducerList)
    );
    const currentObj = JSON.parse(JSON.stringify(tempReducer[from]));
    if (from < to) {
      tempReducer.splice(from, 1);
      tempReducer.splice(to, 0, currentObj);
    } else {
      tempReducer.splice(to, 0, currentObj);
      tempReducer.splice(from + 1, 1);
    }
    calculateAll(memberList, tempReducer, totalLoot);
    setReducerList(tempReducer);
  };

  const handleChangeName = (newName: string, id: string) => {
    const temp: MemberType[] = JSON.parse(JSON.stringify(memberList));
    const currIndex = temp.findIndex((v) => v.id === id);
    temp[currIndex].name = newName;
    setMemberList(temp);
  };

  const handleChangeTimePlayed = (newTimePlayed: number, id: string) => {
    let temp: MemberType[] = JSON.parse(JSON.stringify(memberList));
    const currIndex = temp.findIndex((v) => v.id === id);
    temp[currIndex].timePlayed = newTimePlayed;
    temp = calculateLootPartyPercentage(temp);
    calculateAll(temp, reducerList, totalLoot);
  };

  const handleRemoveMember = (memberId: string) => {
    let temp: MemberType[] = JSON.parse(JSON.stringify(memberList));
    temp = temp.filter((v) => v.id !== memberId);
    temp = calculateLootPartyPercentage(temp);
    calculateAll(temp, reducerList, totalLoot);
  };

  const handleAddNewMember = (newMembers: string[]) => {
    let temp: MemberType[] = JSON.parse(JSON.stringify(memberList));
    temp = [
      ...temp,
      ...newMembers.map((v) => {
        return {
          id: `MEMBER-${Math.random()}`,
          name: v,
          timePlayed: 0,
          lootSplit: 0,
        };
      }),
    ];
    temp = calculateLootPartyPercentage(temp);
    calculateAll(temp, reducerList, totalLoot);
  };

  const handleRemoveReducer = (reducerId: string) => {
    let tempReducer: LootReducerType[] = JSON.parse(
      JSON.stringify(reducerList)
    );
    tempReducer = tempReducer.filter((v) => v.id !== reducerId);
    calculateAll(memberList, tempReducer, totalLoot);
    setReducerList(tempReducer);
  };

  const handleImportData = (file: RcFile) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = (e) => {
      if (!e.target || !_.isString(e.target.result)) return;
      let result: MemberType[] = [];
      try {
        result = JSON.parse(e.target.result);
      } catch (e) {
        api.error({
          message: `Please Upload Correct File`,
          description: "Your file does not supported for this feature",
          placement: "topRight",
        });
        return;
      }
      if (result.length > 0) {
        if (!("name" in result[0])) {
          api.error({
            message: `Please Upload Correct File`,
            description: "Your file does not supported for this feature",
            placement: "topRight",
          });
          return;
        }
      }
      api.success({
        message: `Import Data Success`,
        description: "Your data imported successfully",
        placement: "topRight",
      });
      localStorage.setItem("party-time-tracker-data", JSON.stringify(result));
      const temp = calculateLootPartySummary(result);
      calculateAll(temp, reducerList, totalLoot);
    };
  };

  const handleResetAllData = () => {
    setMemberList([]);
    setReducerList([]);
    setTotalLoot(0);
    setTotalLootNett(0);
    setIsOpenActionDrawer(false);
  };

  return (
    <div style={{ padding: "1em" }}>
      {contextHolder}
      <Tour
        open={openTour}
        onClose={() => setOpenTour(false)}
        steps={[
          {
            title: "Page Action Guide",
            description:
              "Click this floating button to open Loot Split Actions",
            target: () => floatButtonRef.current,
          },
        ]}
      />
      <FloatButton
        ref={floatButtonRef}
        icon={<CaretUpOutlined />}
        type="primary"
        tooltip="Show action for loot splot tools"
        style={{ left: "50%", bottom: 50, width: "60px", height: "60px" }}
        onClick={() => setIsOpenActionDrawer(true)}
      />
      <Drawer
        title={
          <Space size={30}>
            Loot Split Actions
            <Button
              onClick={handleResetAllData}
              icon={<ReloadOutlined />}
              type="primary"
              danger
            >
              Reset/Empty All Data
            </Button>
          </Space>
        }
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
                children: (
                  <ReducerAction
                    onAddLootReducer={(name, type, value) => {
                      handleAddLootReducer(name, type, value);
                    }}
                  />
                ),
              },
              {
                key: "action-members",
                label: (
                  <span>
                    <UsergroupAddOutlined /> Members
                  </span>
                ),
                children: (
                  <NewPartyMemberAction onAddNewMember={handleAddNewMember} />
                ),
              },

              {
                key: "action-import-data",
                label: (
                  <span>
                    <UploadOutlined /> Import Member Log Data
                  </span>
                ),
                children: (
                  <Space
                    direction="vertical"
                    style={{ marginBottom: "2em", width: "100%" }}
                  >
                    <Button
                      onClick={handleUsePreviousData}
                      icon={<SnippetsOutlined />}
                    >
                      Use Previous Party Tracker Log Data
                    </Button>
                    <div>
                      <Upload
                        fileList={[]}
                        beforeUpload={(file) => handleImportData(file)}
                      >
                        <Button icon={<UploadOutlined />}>
                          Upload Member Log Data
                        </Button>
                      </Upload>
                    </div>
                  </Space>
                ),
              },
            ]}
          />
        </div>
      </Drawer>
      <div
        style={{
          display: "grid",
          gridGap: "2em",
          gridTemplateColumns: "1fr 4fr",
        }}
      >
        <div>
          <Typography.Title style={{ marginTop: "3px" }} level={5}>
            Total Loot
          </Typography.Title>
        </div>
        <div>
          <Typography.Title style={{ marginTop: "3px" }} level={5}>
            Loot Split Reducers
          </Typography.Title>
        </div>

        <Space direction="vertical">
          <Card>
            <Statistic title="Total Loot" value={totalLoot} />
          </Card>
          <Card>
            <Statistic title="Total Loot Nett" value={totalLootNett} />
          </Card>
        </Space>
        <div>
          {reducerList.length <= 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div>
                <SubnodeOutlined style={{ fontSize: "100px", color: "gray" }} />
              </div>
              <Typography.Text style={{ textAlign: "center" }}>
                Loot Split Reducers are Empty
              </Typography.Text>
              <Typography.Text style={{ textAlign: "center" }}>
                Add Loot Reducer to reduce total loot before splitted to all
                member
              </Typography.Text>
              <Typography.Text
                style={{ fontWeight: "bold", textAlign: "center" }}
              >
                The order of loot reducers will affect the total loot
                calculation (Use drag n drop to adjust the orders)
              </Typography.Text>
            </div>
          )}
          {reducerList.length > 0 && (
            <DragDropContext
              onDragEnd={(res) =>
                handleDragReducer(res.source.index, res.destination?.index)
              }
            >
              <Droppable droppableId="droppable-1" type="loot-reducer">
                {(provided) => (
                  <Space
                    direction="vertical"
                    style={{
                      width: "100%",
                      maxHeight: "270px",
                      overflow: "auto",
                    }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {reducerList.map((v, i) => {
                      return (
                        <Draggable key={v.id} draggableId={v.id} index={i}>
                          {(provided) => {
                            return (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                      "auto 1fr 1fr 1fr auto",
                                    gridGap: "1em",
                                  }}
                                >
                                  <HolderOutlined />
                                  <Typography.Text
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {v.name}
                                  </Typography.Text>
                                  <div>
                                    {v.type === "percentage"
                                      ? "Percentage"
                                      : "Exact Value"}
                                  </div>
                                  <div>
                                    {`${new Intl.NumberFormat("id-ID").format(
                                      v.value
                                    )}`}{" "}
                                    {v.type === "percentage" && "%"}
                                  </div>
                                  <div>
                                    <Button
                                      type="primary"
                                      danger
                                      onClick={() => handleRemoveReducer(v.id)}
                                      icon={<DeleteOutlined />}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </Card>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Space>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
      <div>
        <Typography.Title level={5}>Loot Split Result</Typography.Title>
      </div>
      <Table
        style={{ marginTop: "2em" }}
        key={"table-loot-split"}
        rowKey={(value) => `loot-split-row-${value.id}`}
        columns={[
          {
            title: "No",
            dataIndex: "no",
            key: "column-no",
            width: 80,
          },
          {
            title: "Member",
            dataIndex: "name",
            key: "column-member",
            render: (text, record) => {
              return (
                <Input
                  key={`column-name-${record.id}`}
                  onChange={(e) => handleChangeName(e.target.value, record.id)}
                  value={text}
                />
              );
            },
          },
          {
            title: "Time Played (Seconds)",
            dataIndex: "timePlayed",
            key: "column-time-played",
            width: 200,
            render: (text, record) => {
              return (
                <InputNumber
                  style={{ width: "100%" }}
                  key={`column-time-played-${record.id}`}
                  value={text}
                  onChange={(value) => handleChangeTimePlayed(value, record.id)}
                />
              );
            },
          },
          {
            title: "Time Played (Hours Format)",
            dataIndex: "timePlayed",
            key: "column-time-played-hours",
            render: (text) => {
              const hours = Math.floor(text / 3600);
              const minutes = Math.floor((text % 3600) / 60);
              const seconds = Math.floor(text % 60);
              return (
                <Typography.Text>
                  {hours}:{minutes}:{seconds}
                </Typography.Text>
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
                  {parseFloat(text).toFixed(2)} %
                </Typography.Text>
              );
            },
          },
          {
            title: "Loot Split",
            dataIndex: "lootSplit",
            key: "column-loot-split",
            width: 300,
            render: (text: number, record) => {
              return (
                <Typography.Text key={`column-loot-percentage-${record.id}`}>
                  {new Intl.NumberFormat("id-ID").format(
                    parseInt(`${Math.round(text)}`)
                  )}
                </Typography.Text>
              );
            },
          },
          {
            title: "Action",
            dataIndex: "id",
            key: "column-action",
            width: 100,
            render: (memberId: string) => {
              return (
                <div>
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleRemoveMember(memberId)}
                    icon={<DeleteOutlined />}
                  >
                    Remove
                  </Button>
                </div>
              );
            },
          },
        ]}
        dataSource={memberList}
      />
    </div>
  );
};

export default LootSplitTool;

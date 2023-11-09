import {
  Button,
  Card,
  Col,
  Collapse,
  Drawer,
  FloatButton,
  Row,
  Space,
  Statistic,
  Tabs,
  Tour,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";

import {
  CaretUpOutlined,
  CloseCircleOutlined,
  FlagOutlined,
  ReloadOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import IndividualStatusLogs from "./components/IndividualStatusLogs";
import SummaryTable from "./components/SummaryTable";
import calculateLootPartySummary from "../Global/helper/calculateLootPartySummary";

export interface StatusLogType {
  status: "Active" | "Break" | "Out";
  time: string;
}

export interface MemberType {
  id: string;
  name: string;
  joinedAt?: string;
  outAt?: string;
  splitPercentage?: number;
  lootSplit?: number;
  currentStatus?: "Active" | "Break" | "Out";
  timePlayed: number;
  statusLog?: StatusLogType[];
}

interface LogType {
  id: string;
  memberName: string;
  action: string;
  logTime: string;
}

const PartyTimeTracker = () => {
  const floatButtonRef = useRef(null);
  const [memberText, setMemberText] = useState<string>("");
  const [memberList, setMemberList] = useState<MemberType[]>([]);
  const [filteredMemberList, setFilteredMemberList] = useState<MemberType[]>(
    []
  );
  const [textSearch, setTextSearch] = useState<string>("");
  const [memberLog, setMemberLog] = useState<LogType[]>([]);
  const [isOpenActionDrawer, setIsOpenActionDrawer] = useState<boolean>(false);
  const [openTour, setOpenTour] = useState<boolean>(true);
  const [activePageTab, setActivePageTab] =
    useState<string>("party-member-log");
  const activeMember = filteredMemberList.filter(
    (v) => v.currentStatus === "Active"
  );
  const breakMember = filteredMemberList.filter(
    (v) => v.currentStatus === "Break"
  );
  const outMember = filteredMemberList.filter((v) => v.currentStatus === "Out");

  useEffect(() => {
    const jsonStorageData = localStorage.getItem("party-time-tracker-data");
    const jsonMemberLog = localStorage.getItem("party-time-tracker-member-log");
    if (!jsonStorageData || !jsonMemberLog) return;
    const storageData = JSON.parse(jsonStorageData);
    const memberLog = JSON.parse(jsonMemberLog);
    setMemberList(storageData);
    setFilteredMemberList(storageData);
    setMemberLog(memberLog);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "party-time-tracker-member-log",
      JSON.stringify(memberLog)
    );
  }, [memberLog]);

  const handleChangeTab = (activeTab: string) => {
    const temp: MemberType[] = calculateLootPartySummary(memberList);
    localStorage.setItem("party-time-tracker-data", JSON.stringify(temp));
    setMemberList(temp);
    setFilteredMemberList(temp);
    setActivePageTab(activeTab);
  };

  const handleAddPartyMember = () => {
    if (memberText.length <= 0) return;
    let temp: MemberType[] = JSON.parse(JSON.stringify(memberList));
    const tempLog: LogType[] = JSON.parse(JSON.stringify(memberLog));
    const newMembers = memberText.split("\n");
    newMembers.map((v) => {
      temp.push({
        id: `MEMBER-${Math.random()}`,
        name: v,
        joinedAt: moment().toISOString(),
        currentStatus: "Active",
        timePlayed: 0,
        statusLog: [{ status: "Active", time: moment().toISOString() }],
      });
      tempLog.push({
        id: `MEMBER-LOG-${Math.random()}`,
        action: "Join Party",
        logTime: moment().toISOString(),
        memberName: v,
      });
    });
    temp = calculateLootPartySummary(temp);
    localStorage.setItem("party-time-tracker-data", JSON.stringify(temp));
    setMemberText("");
    setMemberList(temp);
    setFilteredMemberList(temp);
    setMemberLog(tempLog);
  };

  const handleResetAll = () => {
    localStorage.setItem("party-time-tracker-data", JSON.stringify([]));
    localStorage.setItem("party-time-tracker-member-log", JSON.stringify([]));
    setMemberList([]);
    setFilteredMemberList([]);
    setMemberLog([]);
  };

  const handleChangeStatus = (
    memberId: string,
    status: "Active" | "Break" | "Out"
  ) => {
    const temp: MemberType[] = JSON.parse(JSON.stringify(memberList));
    const tempLog: LogType[] = JSON.parse(JSON.stringify(memberLog));
    const currIndex = _.findIndex(temp, (v) => v.id === memberId);
    temp[currIndex].statusLog?.push({
      status: status,
      time: moment().toISOString(),
    });
    if (status === "Out") {
      temp[currIndex].outAt = moment().toISOString();

      tempLog.push({
        id: `MEMBER-LOG-${Math.random()}`,
        action: "Out From Party",
        logTime: moment().toISOString(),
        memberName: temp[currIndex].name,
      });
    } else if (status === "Active") {
      tempLog.push({
        id: `MEMBER-LOG-${Math.random()}`,
        action: "Join Party",
        logTime: moment().toISOString(),
        memberName: temp[currIndex].name,
      });
    } else if (status === "Break") {
      tempLog.push({
        id: `MEMBER-LOG-${Math.random()}`,
        action: "Take a Break",
        logTime: moment().toISOString(),
        memberName: temp[currIndex].name,
      });
    }
    temp[currIndex].currentStatus = status;
    localStorage.setItem("party-time-tracker-data", JSON.stringify(temp));
    setMemberList(temp);
    setFilteredMemberList(temp);
    setMemberLog(tempLog);
  };

  const handleRemove = (memberId: string) => {
    let temp: MemberType[] = JSON.parse(JSON.stringify(memberList));
    temp = temp.filter((v) => v.id !== memberId);
    localStorage.setItem("party-time-tracker-data", JSON.stringify(temp));
    setMemberList(temp);
    setFilteredMemberList(temp);
  };

  const handleShowSummary = () => {
    const temp: MemberType[] = calculateLootPartySummary(memberList);
    localStorage.setItem("party-time-tracker-data", JSON.stringify(temp));
    setActivePageTab("party-member-summary");
    setMemberList(temp);
    setFilteredMemberList(temp);
  };

  const handleSearch = (text: string) => {
    setTextSearch(text);
  };

  const handleTriggerSearch = (text: string) => {
    let tempFilteredList: MemberType[] = JSON.parse(JSON.stringify(memberList));
    tempFilteredList = tempFilteredList.filter((v) =>
      v.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMemberList(tempFilteredList);
  };

  return (
    <div style={{ padding: "1em" }}>
      <Tour
        open={openTour}
        onClose={() => setOpenTour(false)}
        steps={[
          {
            title: "Page Action",
            description:
              "Click this floating button to open party tracker action",
            target: () => floatButtonRef.current,
          },
        ]}
      />
      <FloatButton
        ref={floatButtonRef}
        icon={<CaretUpOutlined />}
        type="primary"
        tooltip="Show action for loot splot tools"
        style={{ left: "50vw", bottom: 50, width: "60px", height: "60px" }}
        onClick={() => setIsOpenActionDrawer(true)}
      />
      <Drawer
        title="Party Tracker Action"
        placement="bottom"
        onClose={() => {
          setIsOpenActionDrawer(false);
        }}
        open={isOpenActionDrawer}
      >
        <Tabs
          tabPosition="left"
          items={[
            {
              key: "party-tracker-action-member",
              label: (
                <span>
                  <UsergroupAddOutlined /> Party Member
                </span>
              ),
              children: (
                <div
                  style={{
                    display: "grid",
                    gridGap: "2em",
                    gridTemplateColumns: "1fr 1fr",
                  }}
                >
                  <Space direction="vertical">
                    <Typography.Title style={{ margin: 0 }} level={5}>
                      Add New Members
                    </Typography.Title>
                    <TextArea
                      rows={4}
                      value={memberText}
                      placeholder="Add party members"
                      onChange={(e) => setMemberText(e.target.value)}
                    />
                    <div
                      style={{
                        marginTop: "1em",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        type="primary"
                        icon={<UserAddOutlined />}
                        onClick={handleAddPartyMember}
                      >
                        Add And Track Party Member
                      </Button>
                    </div>
                  </Space>
                  <div>
                    <Typography.Title style={{ margin: 0 }} level={5}>
                      Member Actions
                    </Typography.Title>
                    <Button
                      style={{ margin: "5px" }}
                      icon={<FlagOutlined />}
                      size="large"
                      type="primary"
                      ghost
                      onClick={handleShowSummary}
                    >
                      Show Summary
                    </Button>
                    <Button
                      style={{ margin: "5px" }}
                      icon={<ReloadOutlined />}
                      size="large"
                      type="primary"
                      ghost
                      onClick={handleResetAll}
                    >
                      Reset All
                    </Button>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Drawer>
      <Tabs
        activeKey={activePageTab}
        onChange={(activeKey) => handleChangeTab(activeKey)}
        items={[
          {
            key: "party-member-log",
            label: "Party Log",
            children: (
              <div>
                <Row>
                  <Col span={24}>
                    <Search
                      placeholder="Search Member"
                      allowClear
                      value={textSearch}
                      onChange={(e) => handleSearch(e.target.value)}
                      onSearch={(value) => handleTriggerSearch(value)}
                      style={{ width: 200 }}
                    />
                  </Col>
                </Row>
                <div
                  style={{ display: "grid", gridTemplateColumns: "4fr 1fr" }}
                >
                  <Collapse
                    ghost
                    style={{ backgroundColor: "#F0F2F5" }}
                    items={[
                      {
                        key: "active-member",
                        label: `Member Active (${activeMember.length})`,
                        children: (
                          <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {activeMember.map((v) => {
                              return (
                                <div
                                  style={{ padding: "1em" }}
                                  key={`memberlist-${v.id}`}
                                >
                                  <Card
                                    style={{ marginTop: "1" }}
                                    title={
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <span>{v.name}</span>
                                        <Button
                                          icon={<CloseCircleOutlined />}
                                          danger
                                          type="link"
                                          onClick={() => handleRemove(v.id)}
                                        />
                                      </div>
                                    }
                                  >
                                    <Space direction="vertical">
                                      <Statistic
                                        title="Joined At"
                                        value={moment(v.joinedAt).format(
                                          "DD MMM YYYY HH:mm:ss"
                                        )}
                                      />
                                      <IndividualStatusLogs
                                        statusLogs={v.statusLog}
                                      />
                                      <Row gutter={10} justify={"end"}>
                                        <Col>
                                          <Button
                                            onClick={() =>
                                              handleChangeStatus(v.id, "Break")
                                            }
                                          >
                                            Break
                                          </Button>
                                        </Col>
                                        <Col>
                                          <Button
                                            danger
                                            type="primary"
                                            onClick={() =>
                                              handleChangeStatus(v.id, "Out")
                                            }
                                          >
                                            Out
                                          </Button>
                                        </Col>
                                      </Row>
                                    </Space>
                                  </Card>
                                </div>
                              );
                            })}
                          </div>
                        ),
                      },
                      {
                        key: "break-member",
                        label: `Member On Break (${breakMember.length})`,
                        children: (
                          <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {breakMember.map((v) => {
                              return (
                                <div
                                  style={{ padding: "1em" }}
                                  key={`break-memberlist-${v.id}`}
                                >
                                  <Card
                                    title={
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <span>{v.name}</span>
                                        <Button
                                          onClick={() => handleRemove(v.id)}
                                          icon={<CloseCircleOutlined />}
                                          danger
                                          type="link"
                                        />
                                      </div>
                                    }
                                  >
                                    <Space direction="vertical">
                                      <Statistic
                                        title="Joined At"
                                        value={moment(v.joinedAt).format(
                                          "DD MMM YYYY HH:mm:ss"
                                        )}
                                      />
                                      <IndividualStatusLogs
                                        statusLogs={v.statusLog}
                                      />
                                      <Row gutter={10} justify={"end"}>
                                        <Col>
                                          <Button
                                            type="primary"
                                            onClick={() =>
                                              handleChangeStatus(v.id, "Active")
                                            }
                                          >
                                            Join
                                          </Button>
                                        </Col>
                                        <Col>
                                          <Button
                                            danger
                                            type="primary"
                                            onClick={() =>
                                              handleChangeStatus(v.id, "Out")
                                            }
                                          >
                                            Out
                                          </Button>
                                        </Col>
                                      </Row>
                                    </Space>
                                  </Card>
                                </div>
                              );
                            })}
                          </div>
                        ),
                      },
                      {
                        key: "out-member",
                        label: `Member Out From Party (${outMember.length})`,
                        children: (
                          <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {outMember.map((v) => {
                              // const hours = Math.floor(v.timePlayed / 3600);
                              // const minutes = Math.floor((v.timePlayed % 3600) / 60);
                              // const seconds = Math.floor(v.timePlayed % 60);
                              return (
                                <div
                                  style={{ padding: "1em" }}
                                  key={`break-memberlist-${v.id}`}
                                >
                                  <Card
                                    title={
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <span>{v.name}</span>
                                        <Button
                                          onClick={() => handleRemove(v.id)}
                                          icon={<CloseCircleOutlined />}
                                          danger
                                          type="link"
                                        />
                                      </div>
                                    }
                                  >
                                    <Space direction="vertical">
                                      <Statistic
                                        title="Joined At"
                                        value={moment(v.joinedAt).format(
                                          "DD MMM YYYY HH:mm:ss"
                                        )}
                                      />
                                      <Statistic
                                        title="Out From Party At"
                                        value={moment(v.outAt).format(
                                          "DD MMM YYYY HH:mm:ss"
                                        )}
                                      />
                                      <IndividualStatusLogs
                                        statusLogs={v.statusLog}
                                      />
                                    </Space>
                                  </Card>
                                </div>
                              );
                            })}
                          </div>
                        ),
                      },
                    ]}
                  />
                  <div>
                    <Card title="Member Log">
                      <div style={{ height: "400px", overflow: "auto" }}>
                        <Space direction="vertical">
                          {memberLog.map((v) => {
                            return (
                              <div key={v.id}>
                                <span
                                  style={{
                                    background: "#797d7b",
                                    color: "white",
                                    padding: "4px",
                                  }}
                                >
                                  {v.memberName}
                                </span>{" "}
                                <Typography.Text
                                  type={
                                    v.action === "Join Party"
                                      ? "success"
                                      : v.action === "Take a Break"
                                      ? "warning"
                                      : "danger"
                                  }
                                >
                                  {v.action}
                                </Typography.Text>{" "}
                                <Typography.Text>
                                  {moment(v.logTime).format(
                                    "DD/MM/YY HH:mm:ss"
                                  )}
                                </Typography.Text>
                              </div>
                            );
                          })}
                        </Space>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: "party-member-summary",
            label: "Party Summary",
            children: (
              <SummaryTable
                memberList={filteredMemberList}
                onClickRefreshCalculation={handleShowSummary}
                textSearch={textSearch}
                onSearchChange={(value) => handleSearch(value)}
                onSearch={(value) => handleTriggerSearch(value)}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default PartyTimeTracker;

import { Button, Card, Col, Collapse, Row, Statistic } from "antd";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import { useEffect, useState } from "react";
import _ from "lodash";
import {
  CloseCircleOutlined,
  FlagOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";

interface MemberType {
  id: string;
  name: string;
  joinedAt: string;
  outAt?: string;
  splitPercentage?: number;
  currentStatus: "Active" | "Break" | "Out";
  timePlayed: number;
}

const PartyTimeTracker = () => {
  const [memberText, setMemberText] = useState<string>("");
  const [memberList, setMemberList] = useState<MemberType[]>([]);
  const [filteredMemberList, setFilteredMemberList] = useState<MemberType[]>(
    []
  );
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [textSearch, setTextSearch] = useState<string>("");
  const activeMember = filteredMemberList.filter(
    (v) => v.currentStatus === "Active"
  );
  const breakMember = filteredMemberList.filter(
    (v) => v.currentStatus === "Break"
  );
  const outMember = filteredMemberList.filter((v) => v.currentStatus === "Out");

  useEffect(() => {
    let timer: number | undefined;
    if (isStart) {
      timer = setInterval(() => {
        let tempMemberList: MemberType[] = JSON.parse(
          JSON.stringify(memberList)
        );
        let tempFilteredList: MemberType[] = JSON.parse(
          JSON.stringify(memberList)
        );
        tempMemberList = tempMemberList.map((v) => {
          if (v.currentStatus === "Active") {
            return Object.assign(v, { timePlayed: v.timePlayed + 1 });
          }
          return v;
        });
        tempFilteredList = tempMemberList.filter((v: MemberType) =>
          v.name.toLowerCase().includes(textSearch.toLowerCase())
        );
        const tempElapsedTime = elapsedTime + 1;
        setMemberList(tempMemberList);
        setFilteredMemberList(tempFilteredList);
        setElapsedTime(tempElapsedTime);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [elapsedTime, isStart, memberList]);

  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = Math.floor(elapsedTime % 60);

  const handleAddPartyMember = () => {
    if (memberText.length <= 0) return;
    const temp = JSON.parse(JSON.stringify(memberList));
    const newMembers = memberText.split("\n");
    newMembers.map((v) => {
      temp.push({
        id: `MEMBER-${Math.random()}`,
        name: v,
        joinedAt: moment().toISOString(),
        currentStatus: "Active",
        timePlayed: 0,
      });
    });
    setMemberText("");
    setMemberList(temp);
    setFilteredMemberList(temp);
  };

  const handleStart = () => {
    setIsStart(!isStart);
  };

  const handleResetAll = () => {
    setIsStart(false);
    setMemberList([]);
    setFilteredMemberList([]);
    setElapsedTime(0);
  };

  const handleChangeStatus = (
    memberId: string,
    status: "Active" | "Break" | "Out"
  ) => {
    const temp: MemberType[] = JSON.parse(JSON.stringify(memberList));
    const currIndex = _.findIndex(temp, (v) => v.id === memberId);
    temp[currIndex].currentStatus = status;
    setMemberList(temp);
    setFilteredMemberList(temp);
  };

  const handleRemove = (memberId: string) => {
    let temp: MemberType[] = JSON.parse(JSON.stringify(memberList));
    temp = temp.filter((v) => v.id !== memberId);
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
      <div
        style={{
          display: "grid",
          gridGap: "1em",
          gridTemplateColumns: "4fr 1fr",
        }}
      >
        <Card title="Party Time Tracker">
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
              Add Party Member
            </Button>
          </div>
        </Card>
        <Card>
          <Row align={"middle"} justify={"space-between"}>
            <Col>
              <Statistic
                title="Timer"
                value={`${hours}:${minutes}:${seconds}`}
              />
            </Col>
            <Col>
              {isStart ? (
                <Button onClick={handleStart} icon={<PauseCircleOutlined />}>
                  Pause
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={handleStart}
                >
                  Start
                </Button>
              )}
            </Col>
          </Row>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "3em",
            }}
          >
            <Button
              style={{ margin: "5px" }}
              icon={<FlagOutlined />}
              size="large"
              type="primary"
              ghost
            >
              Finish
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
        </Card>
      </div>
      <Row style={{ marginTop: "2em" }}>
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
                  const hours = Math.floor(v.timePlayed / 3600);
                  const minutes = Math.floor((v.timePlayed % 3600) / 60);
                  const seconds = Math.floor(v.timePlayed % 60);
                  return (
                    <div style={{ padding: "1em" }} key={`memberlist-${v.id}`}>
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
                        <Statistic
                          title="Joined At"
                          value={moment(v.joinedAt).format("DD MMM YYYY HH:mm")}
                        />
                        <Statistic
                          title="Time Played"
                          value={`${hours}:${minutes}:${seconds}`}
                        />
                        <Row gutter={10} justify={"end"}>
                          <Col>
                            <Button
                              onClick={() => handleChangeStatus(v.id, "Break")}
                            >
                              Break
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              danger
                              type="primary"
                              onClick={() => handleChangeStatus(v.id, "Out")}
                            >
                              Out
                            </Button>
                          </Col>
                        </Row>
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
                  const hours = Math.floor(v.timePlayed / 3600);
                  const minutes = Math.floor((v.timePlayed % 3600) / 60);
                  const seconds = Math.floor(v.timePlayed % 60);
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
                        <Statistic
                          title="Joined At"
                          value={moment(v.joinedAt).format("DD MMM YYYY HH:mm")}
                        />
                        <Statistic
                          title="Time Played"
                          value={`${hours}:${minutes}:${seconds}`}
                        />
                        <Row gutter={10} justify={"end"}>
                          <Col>
                            <Button
                              type="primary"
                              onClick={() => handleChangeStatus(v.id, "Active")}
                            >
                              Join
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              danger
                              type="primary"
                              onClick={() => handleChangeStatus(v.id, "Out")}
                            >
                              Out
                            </Button>
                          </Col>
                        </Row>
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
                  const hours = Math.floor(v.timePlayed / 3600);
                  const minutes = Math.floor((v.timePlayed % 3600) / 60);
                  const seconds = Math.floor(v.timePlayed % 60);
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
                        <Statistic
                          title="Joined At"
                          value={moment(v.joinedAt).format("DD MMM YYYY HH:mm")}
                        />
                        <Statistic
                          title="Out From Party At"
                          value={moment(v.outAt).format("DD-MM-YYYY HH:mm")}
                        />
                        <Statistic
                          title="Time Played"
                          value={`${hours}:${minutes}:${seconds}`}
                        />
                      </Card>
                    </div>
                  );
                })}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default PartyTimeTracker;
